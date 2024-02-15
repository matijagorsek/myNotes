import express from 'express';
import { createNote, updateNote, deleteNote, getAllNotes,getAllNotesByAuthor } from '../controllers/noteControllers';

const router = express.Router();

router.post('/', createNote);
router.put('/', updateNote);
router.delete('/:id', deleteNote);
router.get('/', getAllNotes);
router.get('/byAuthor', getAllNotesByAuthor);

export default router;