import express from 'express';
import { createNote, updateNote, deleteNote, getAllNotes, getAllNotesByAuthor, getNoteById } from '../controllers/NoteController';
import { validateId } from '../../validators/validators';


const router = express.Router();

router.post('/', createNote);
router.get('/', getAllNotes);
router.get('/byAuthor', validateId, getAllNotesByAuthor);
router.get('/:id', validateId, getNoteById)
router.patch('/:id', validateId, updateNote);
router.delete('/:id', validateId, deleteNote);


export default router;