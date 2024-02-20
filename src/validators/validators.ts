import { NextFunction, Response, Request } from "express";
import { validate } from "uuid";


export const validateId = (req: Request, res: Response, next: NextFunction) => {
  const noteId = req.params.id;
  if (!validate(noteId)) {
    return res.status(400).json({ message: 'Invalid note ID.' });
  }
  next();
};

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPasswordLength(password: string): boolean {
  const hasMinimumLength = password.length >= 8;
  return hasMinimumLength
}

export function isUppercaseAndSpecialCharacterPassword(password: string): boolean {
  const passwordRegex = /^(?=.*[A-Z!@#$%^&*])/;
  return passwordRegex.test(password);
}

export function isAuthTokenValid(authToken :string):boolean{
  return false
}
