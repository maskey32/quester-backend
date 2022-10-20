import express from'express';
import { delUser, getUser, viewUsers, verify, adLogin } from '../controllers/adminController';
const router = express.Router();

router.get('/users', viewUsers)
router.get('/user/:id', getUser)
router.delete('/delete/:id', delUser)
router.patch('/verify', verify)
router.post('/login', adLogin)

export default router