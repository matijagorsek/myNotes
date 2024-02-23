import { Request, Response } from 'express';
import Note from '../models/Note';
import { checkIfNoteExist, deleteNoteFromDb, fetchAllNotesFromDb, fetchUsersNotes, saveNoteToDB, updateNoteInTheDB } from '../../db/NotesDbRepo';
import { getTimestamp } from '../../utilities/Utilities';
import { ObjectId } from 'mongodb';
import { getAuthorId } from '../../auth/AuthMiddleware';

const notes: Note[] = [];


export const createNote = async (req: Request, res: Response) => {
  const { content } = req.body;
  const authorId = await getAuthorId(req)
  if (!content) {
    return res.status(400).json({ message: 'Content is required.' });
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


export const updateNote = async (req: Request, res: Response) => {
  const noteId = req.params.id;
  const content = req.body.content;

  const note = await checkIfNoteExist(noteId)

  if (!note) {
    return res.status(404).json({ message: 'Note not found.' });
  }

  note.content = content || note.content;
  note.updatedAt = getTimestamp();
  await updateNoteInTheDB(content, noteId, note.updatedAt)
  return res.json(note);
};

export const deleteNote = (req: Request, res: Response) => {
  const noteId = req.params.id;
  const checkIfNoteDeleted = deleteNoteFromDb(noteId)
  if (!checkIfNoteDeleted) {
    return res.status(404).json({ message: 'Note not found.' });
  }
  return res.status(200).send();
};

export const getAllNotes = async (req: Request, res: Response) => {
  const notes = await fetchAllNotesFromDb()
  return res.status(200).json(notes)
}

export const getAllNotesByAuthor = async (req: Request, res: Response) => {
  const authorId = await getAuthorId(req);
  console.log('FilteredId', authorId)
  if (!authorId) {
    return res.status(400).json({ message: 'AuthorId is required.' });
  }

  const filteredNotes = await fetchUsersNotes(authorId);
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