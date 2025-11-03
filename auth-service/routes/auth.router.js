import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { rbacMiddleware } from '../middlewares/rbac.middleware.js';
import { Roles } from '../constants/roles.constants.js';

const router = express.Router();    

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, (req, res) => {
    res.json({ success: true, message: 'User Profile data', user: req.user });
})
router.get('/admin/dashboard', authMiddleware, rbacMiddleware([Roles.ADMIN]), (req, res) => {
    res.json({ success: true, message: 'Admin Dashboard data', user: req.user });
});

export default router;