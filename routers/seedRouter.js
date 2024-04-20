import express from 'express';
import seedService from '../services/seedService.js';
const router = express.Router();

router.get('/', seedService.seedDatabase);

export default router;