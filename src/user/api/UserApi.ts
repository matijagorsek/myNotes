import express from 'express';
import { deleteAllUsers, loginUser, refreshToken, registerUser } from '../controllers/UserController';
import { verifyToken } from '../../auth/AuthMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refreshToken', refreshToken);
router.delete('/deleteUsers', verifyToken, deleteAllUsers);

export default router;