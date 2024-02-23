import express from 'express';
import { loginUser, refreshToken, registerUser } from '../controllers/UserController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refreshToken',refreshToken);

export default router;