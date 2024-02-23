import { NextFunction, Response, Request } from "express";
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { tokenApiKey } from "..";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }
  jwt.verify(token, tokenApiKey, (error, decoded) => {
    if (error) {
      console.error('Error verifying token:', error.message);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(403).json({ message: 'Invalid token' });
      } else {
        return res.status(500).json({ message: 'Failed to authenticate token' });
      }
    }
    next();
  });
};

export const getAuthorId = async (req: Request): Promise<string> => {
  const token = req.headers.authorization?.split(' ')[1] as string
  return new Promise((resolve, reject) => {
    if (!token) {
      reject('No token provided');
    }

    jwt.verify(token, tokenApiKey, (error: VerifyErrors | null, decoded: any) => {
      if (error) {
        console.error('Failed to verify token:', error);
        reject('Failed to verify token');
      } else {
        const userIdFromToken = decoded.userId;
        resolve(userIdFromToken);
      }
    });
  });
}