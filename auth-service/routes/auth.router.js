import express from 'express';
import { registerUser, loginUser, refreshToken, logout } from '../controllers/auth.controller.js';

const router = express.Router();    

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/refresh-token', refreshToken)
router.post('/logout', logout)

export default router;