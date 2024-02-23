import { NextFunction,Response, Request } from "express";
import jwt from 'jsonwebtoken';
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