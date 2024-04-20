import express from 'express';
import recommendationService from '../services/recommendationService.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/posts', authMiddleware,recommendationService.getPosts);

export default router;