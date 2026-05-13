import express from 'express';
import { addVisitor, getVisitors, deleteVisitor, updateVisitor } from '../controllers/visitorController.js';

const router = express.Router();

router.get('/', getVisitors);
router.post('/', addVisitor);
router.put('/:id', updateVisitor);
router.delete('/:id', deleteVisitor);

export default router;
