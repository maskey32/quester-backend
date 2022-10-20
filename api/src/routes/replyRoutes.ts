import express from 'express'
import { delReply, reply, getReplies } from '../controllers/replyController';
import { auth } from '../middleware/auth';
const router = express.Router();

router.post('/reply', auth, reply)
router.delete('/del-reply/:id',auth, delReply)
router.get('/replies', auth, getReplies)

export default router