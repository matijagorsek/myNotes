import express from 'express';
import { createNote, updateNote, deleteNote, getAllNotes, getAllNotesByAuthor, getNoteById } from '../controllers/NoteController';
import { verifyToken } from '../../auth/AuthMiddleware';

const router = express.Router();

router.post('/', verifyToken, createNote);
router.get('/', verifyToken, getAllNotes);
router.get('/byAuthor', verifyToken, getAllNotesByAuthor);
router.get('/:id', verifyToken, getNoteById)
router.patch('/:id', verifyToken, updateNote);
router.delete('/:id', verifyToken, deleteNote);

export default router;