import express from 'express';
import { loginUser, registerUser } from '../controllers/UserController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;