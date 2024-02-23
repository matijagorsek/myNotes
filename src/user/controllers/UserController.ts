import { Request, Response } from 'express';
import User from "../models/User"
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { isUppercaseAndSpecialCharacterPassword, isValidEmail, isValidPasswordLength } from '../../validators/validators';
import { ObjectId } from 'mongodb';
import { checkIfUserExist, loginUserWithDb, saveUserToDB } from '../../db/UserRepo';
import { refreshTokenApiKey, tokenApiKey } from '../..';


let users: any[] = [];

export const registerUser = async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, userRole, gender } = req.body;
    try {
        if (await checkIfUserExist(email))
            return res.status(400).json({ message: 'User with this email already exists' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (!firstName || !lastName || !email || !userRole || !password || !-1) {
        return res.status(400).json({ message: 'All fields are required for registration.' });
    }

    if (!isValidEmail(req.body.email)) {
        return res.status(400).json({ message: 'Wrong Email format' });
    }

    if (!isValidPasswordLength(req.body.password)) {
        return res.status(400).json({ message: 'Password needs to contain at least 8 letters' });
    }

    if (!isUppercaseAndSpecialCharacterPassword(req.body.password)) {
        return res.status(400).json({ message: 'Password needs to contain at uppercase letter and special character' });
    }


    const _id = new ObjectId();
    const newUser: User = {
        _id,
        firstName,
        lastName,
        email,
        password,
        userRole,
        gender,
    };

    saveUserToDB(newUser);
    users.push(newUser);

    return res.status(201).json(newUser);
};

export const loginUser = async (req: Request, res: Response) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'All fields are required for login.' });
    }
    if (!isValidEmail(req.body.email)) {
        return res.status(400).json({ message: 'Wrong Email format' });
    }
    const { email, password } = req.body;
    try {
        const ifUserExist = await loginUserWithDb(email, password)
        if (!ifUserExist[0]) return res.status(404).json({ message: 'Wrong credentials' });
        else returnUserData(email, res, ifUserExist[1]);

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

function returnUserData(email: string, res: Response, id: ObjectId) {
    const authToken = jwt.sign({ email: email, userId: id }, tokenApiKey, { expiresIn: '2m' });
    const refreshToken = jwt.sign({ email: email, userId: id }, refreshTokenApiKey, { expiresIn: '3d' });

    return res.status(200).json({ authToken: authToken, refreshToken: refreshToken, expiresIn: '2m' });
}



export const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;
    let userEmailFromToken = ''
    let userIdFromToken = ''
    jwt.verify(refreshToken, tokenApiKey, (error: VerifyErrors | null, decoded: any) => {
        if (error) {
            console.error('Failed to verify token:', error);
        } else {
            userEmailFromToken = decoded.email;
            userIdFromToken = decoded.userId;
        }
    });
    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }
    console.log('RefreshedData', userEmailFromToken, userIdFromToken)
    const authToken = jwt.sign({ email: userEmailFromToken, userId: userIdFromToken }, tokenApiKey, { expiresIn: '2m' });
    const newRefreshToken = jwt.sign({ email: userEmailFromToken, userId: userIdFromToken }, refreshTokenApiKey, { expiresIn: '3d' });
    return res.status(200).json({ authToken: authToken, refreshToken: newRefreshToken, expiresIn: '2m' });
}



