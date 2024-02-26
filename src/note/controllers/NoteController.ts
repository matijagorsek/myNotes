import { Request, Response } from 'express';
import Note from '../models/Note';
import NotesMongoDbRepo from '../../db/NotesMongoDbRepo';
import { getTimestamp } from '../../utilities/Utilities';
import { ObjectId } from 'mongodb';
import { getAuthorId, getUserRole } from '../../auth/AuthMiddleware';
import { NoteRepo } from '../repo/NoteRepo';
import UserRole, { toUserRole } from '../../user/models/UserRole';

const notes: Note[] = [];
const notesImpl: NoteRepo = new NotesMongoDbRepo()

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


  notesImpl.saveNote(newNote)
  notes.push(newNote);

  return res.status(200).json(newNote);
};


export const updateNote = async (req: Request, res: Response) => {
  const noteId = req.params.id;
  const content = req.body.content;
  const note = await notesImpl.checkIfNoteExist(noteId)
  if (toUserRole(await getUserRole(req)) != UserRole.ADMIN) {
    return res.status(403).json({ message: 'User cannot update the note.' });
  }
  if (!note) {
    return res.status(404).json({ message: 'Note not found.' });
  }

  note.content = content || note.content;
  note.updatedAt = getTimestamp();
  await notesImpl.updateNote(content, noteId, note.updatedAt)
  return res.json(note);
};

export const deleteNote = async (req: Request, res: Response) => {
  const noteId = req.params.id;
  
  if (toUserRole(await getUserRole(req)) != UserRole.ADMIN) {
    return res.status(403).json({ message: 'User cannot delete the note.' });
  }
  const checkIfNoteDeleted = notesImpl.deleteNote(noteId)
  if (!checkIfNoteDeleted) {
    return res.status(404).json({ message: 'Note not found.' });
  }
  return res.status(200).send();
};

export const getAllNotes = async (req: Request, res: Response) => {
  const notes = await notesImpl.fetchAllNotes()
  return res.status(200).json(notes)
}

export const getAllNotesByAuthor = async (req: Request, res: Response) => {
  const authorId = await getAuthorId(req);
  console.log('FilteredId', authorId)
  if (!authorId) {
    return res.status(400).json({ message: 'AuthorId is required.' });
  }

  const filteredNotes = await notesImpl.fetchUsersNotes(authorId);
  if (filteredNotes.length == 0) {
    return res.status(204).json({ message: 'There are no notes for this user.' });
  }
  return res.json(filteredNotes);
};


export const getNoteById = async (req: Request, res: Response) => {
  const noteId = req.params.id;
  const note = await notesImpl.fetchNote(noteId)
  if (!note) {
    return res.status(404).json({ message: 'Note not found.' });
  }
  return res.json(note);
};