import { Request, Response } from 'express';
import User from "../models/User"
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { isUppercaseAndSpecialCharacterPassword, isValidEmail, isValidPasswordLength } from '../../validators/validators';
import { ObjectId } from 'mongodb';
import { tokenApiKey } from '../..';
import { UserRepo } from '../repo/UserRepo';
import UserMongoDbRepo from '../../db/UserMongoDbRepo';
import UserRole, { toUserRole } from '../models/UserRole';
import { getUserRole } from '../../auth/AuthMiddleware';


let users: any[] = [];
const userRepo: UserRepo = new UserMongoDbRepo()

export const registerUser = async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, userRole, gender } = req.body;
    try {
        if (await userRepo.checkIfUserExist(email))
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

    userRepo.createUser(newUser);
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
        const ifUserExist = await userRepo.loginUser(email, password)
        if (!ifUserExist[0]) return res.status(404).json({ message: 'Wrong credentials' });
        else returnUserData(email, res, ifUserExist[1]);

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

function returnUserData(email: string, res: Response, user: User) {
    const authToken = jwt.sign({ email: email, userId: user._id, userRole: user.userRole }, tokenApiKey, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ email: email, userId: user._id, userRole: user.userRole }, tokenApiKey, { expiresIn: '3d' });

    return res.status(200).json({ authToken: authToken, refreshToken: refreshToken, expiresIn: '15m' });
}



export const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.body.refreshToken;
    let userEmailFromToken = ''
    let userIdFromToken = ''
    let userRoleFromToken = ''
    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }
    jwt.verify(refreshToken, tokenApiKey, (error: VerifyErrors | null, decoded: any) => {
        if (error) {
            console.error('Error verifying refresh token:', error.message);
            if (error.name === 'RefreshTokenExpiredError') {
                return res.status(401).json({ message: 'Refresh Token expired' });
            } else if (error.name === 'JsonWebRefreshTokenError') {
                return res.status(403).json({ message: 'Invalid refresh token' });
            } else {
                return res.status(500).json({ message: 'Failed to authenticate refresh token' });
            }
        } else {
            userEmailFromToken = decoded.email;
            userIdFromToken = decoded.userId;
            userRoleFromToken = decoded.userRole;
        }
    });
    console.log('RefreshedData', userEmailFromToken, userIdFromToken, userRoleFromToken)
    const authToken = jwt.sign({ email: userEmailFromToken, userId: userIdFromToken, userRole: userRoleFromToken }, tokenApiKey, { expiresIn: '15m' });
    const newRefreshToken = jwt.sign({ email: userEmailFromToken, userId: userIdFromToken, userRole: userRoleFromToken }, tokenApiKey, { expiresIn: '3d' });
    return res.status(200).json({ authToken: authToken, refreshToken: newRefreshToken, expiresIn: '15m' });
}

export const deleteAllUsers = async (req: Request, res: Response) => {
    if (toUserRole(await getUserRole(req)) != UserRole.ADMIN) {
        return res.status(403).json({ message: 'User has no permission for the deletion.' });
    }
    if (userRepo.fetchAllUsers.length > 0) {
        userRepo.deleteAllUsers
        return res.status(200)
    }
    return res.status(400).json({ message: 'There are no users to delete.' })
}



