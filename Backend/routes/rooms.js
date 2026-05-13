import express from "express";
import { createRoom, getAvailableRooms, getAllRooms, getEmptyRooms, deleteRoom, updateRoom } from "../controllers/roomController.js";

const router = express.Router();

router.get('/', getAllRooms);
router.get('/available', getAvailableRooms);
router.get('/empty', getEmptyRooms);
router.post('/', createRoom);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

export default router;
