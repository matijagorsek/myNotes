import { ObjectId } from 'mongodb';
import User from '../user/models/User';
import { tokenApiKey } from '..';
import jwt from 'jsonwebtoken';

export function generateUniqueId(): ObjectId {
    return new ObjectId();
}

export function getTimestamp(): number {
    return new Date().getTime()
}

export function generateToken(user: User, expirationTime: string): string {
    return jwt.sign({ email: user.email, userId: user._id, userRole: user.userRole }, tokenApiKey, { expiresIn: expirationTime });
}