import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import User from "../models/User"
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { isUppercaseAndSpecialCharacterPassword, isValidEmail, isValidPasswordLength } from '../../validators/validators';

const users: User[] = [];

export const registerUser = (req: Request, res: Response) => {
    const { firstName, lastName, email, password, userRole, gender } = req.body;
    console.log(req.body)
    if (!firstName || !lastName || !email || !userRole || !password || !-1) {
        return res.status(400).json({ message: 'All fields are required for registration.' });
    }

    if (users.some((user) => user.email === email)) {
        return res.status(400).json({ message: 'User with this email already exists' });
    }

    if (!isValidEmail(req.body.email)) {
        return res.status(400).json({ message: 'Wrong Email format' });
    }

    if (users.some((user) => user.email === email)) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    if (!isValidPasswordLength(req.body.password)) {
        return res.status(400).json({ message: 'Password needs to contain at least 8 letters' });
    }

    if (!isUppercaseAndSpecialCharacterPassword(req.body.password)) {
        return res.status(400).json({ message: 'Password needs to contain at uppercase letter and special character' });
    }

    const id = uuidv4();
    const newUser: User = {
        id,
        firstName,
        lastName,
        email,
        password,
        userRole,
        gender,
    };

    users.push(newUser);

    return res.status(201).json(newUser);
};

export const loginUser = (req: Request, res: Response) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'All fields are required for login.' });
    }
    if (!isValidEmail(req.body.email)) {
        return res.status(400).json({ message: 'Wrong Email format' });
    }
    const { email, password } = req.body;
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    const authToken = jwt.sign({ email: user.email }, crypto.randomBytes(32).toString('hex'), { expiresIn: 3600000 });
    const refreshToken = crypto.randomBytes(32).toString('hex');
    return res.status(200).json({ authToken: authToken, refreshToken: refreshToken, expiresIn: 3600000 });
};
