import { Request, Response } from 'express';
import Note from '../models/Note';
import { saveNoteToDB } from '../../db/NotesDbRepo';
import { generateUniqueId, getTimestamp } from '../../utilities/Utilities';
import { ObjectId } from 'mongodb';

const notes: Note[] = [];


export const createNote = (req: Request, res: Response) => {
  const { content, authorId } = req.body;

  if (!content || !authorId) {
    return res.status(400).json({ message: 'Both content and authorId are required.' });
  }

  const existingNote = notes.find(note => note.content === content && note.authorId === authorId);

  if (existingNote) {
    return res.status(400).json({ message: 'A note with the same content and authorId already exists.' });
  }


  const newNote: Note = {
    _id: new ObjectId(),
    content,
    createdAt: getTimestamp(),
    updatedAt: getTimestamp(),
    authorId
  };

  saveNoteToDB(newNote)


  notes.push(newNote);

  return res.status(200).json(newNote);
};


export const updateNote = (req: Request, res: Response) => {
  const noteId = req.params.id;
  const content = req.body.content;

  const note = notes.find(note => note._id.toString() === noteId);

  if (!note) {
    return res.status(404).json({ message: 'Note not found.' });
  }

  note.content = content || note.content;
  note.updatedAt = getTimestamp();

  return res.json(note);
};

export const deleteNote = (req: Request, res: Response) => {
  const noteId = req.params.id;
  const noteIndex = notes.findIndex(note => note._id.toString() === noteId);
  if (noteIndex === -1) {
    return res.status(404).json({ message: 'Note not found.' });
  }
  notes.splice(noteIndex, 1);
  return res.status(200).send();
};

export const getAllNotes = (req: Request, res: Response) => {
  return res.json(notes);
};

export const getAllNotesByAuthor = (req: Request, res: Response) => {
  const authorId = req.query.authorId;

  if (!authorId) {
    return res.status(400).json({ message: 'AuthorId is required.' });
  }

  const filteredNotes = notes.filter(note => note.authorId === authorId);
  if (filteredNotes.length == 0) {
    return res.status(204).json({ message: 'There are no notes for this user.' });
  }
  return res.json(filteredNotes);
};


export const getNoteById = (req: Request, res: Response) => {
  const noteId = req.params.id;
  const note = notes.find(note => note._id.toString() === noteId);
  if (!note) {
    return res.status(404).json({ message: 'Note not found.' });
  }
  return res.json(note);
};