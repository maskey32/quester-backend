import express from'express';
import { createPosts, delPosts, getPost, getPosts } from '../controllers/postController';
import { auth } from '../middleware/auth';
const router = express.Router();

router.post('/create', auth,createPosts)
router.get('/', auth, getPosts)
router.get('/post/:id', auth, getPost)
router.delete('/del-post/:id', auth, delPosts)

export default router