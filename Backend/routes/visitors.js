import express from 'express';
import { addVisitor, getVisitors } from '../controllers/visitorController.js';

const router = express.Router();

router.get('/', getVisitors);
router.post('/', addVisitor);

export default router;
