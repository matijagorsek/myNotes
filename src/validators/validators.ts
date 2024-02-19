import { NextFunction,Response,Request } from "express";
import { validate } from "uuid";


export const validateId = (req: Request, res: Response, next: NextFunction) => {
    const noteId = req.params.id;
    console.log("ID",noteId)
    if (!validate(noteId)) {
      return res.status(400).json({ message: 'Invalid note ID.' });
    }
    next();
  };

  export const validateAuthorId = (req: Request, res: Response, next: NextFunction) => {
    const noteId = req.params.authorId;
  
    if (!validate(noteId)) {
      return res.status(400).json({ message: 'Invalid author ID.' });
    }
    next();
  };