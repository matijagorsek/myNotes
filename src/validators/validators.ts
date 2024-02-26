import { NextFunction, Response, Request } from "express";
import { ObjectId } from "mongodb";
import { validate } from "uuid";


export function validateId(req: Request, res: Response): boolean {
  const noteId = req.params.id;
  const objectNoteID = new ObjectId(noteId)
  if (!ObjectId.isValid(objectNoteID)) {
    return false
  } else {
    return true
  }
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
