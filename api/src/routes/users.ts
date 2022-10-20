import express from 'express';
import { loginUser, logout, signupUser, dash, editUser, reqVerification } from '../controllers/userController';
import { auth } from '../middleware/auth';
const router = express.Router();


router.post('/register', signupUser);
router.post('/login', loginUser);
router.get('/logout', auth, logout);
router.get('/dashboard', auth, dash);
router.patch('/edit/:id', auth, editUser);
router.post('/verify', auth, reqVerification)

export default router;
