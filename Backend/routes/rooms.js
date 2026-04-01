import express from "express";
import { createRoom, getAvailableRooms, getAllRooms, getEmptyRooms } from "../controllers/roomController.js";

const router = express.Router();

router.post('/', createRoom);
router.get('/available', getAvailableRooms);
router.get('/empty', getEmptyRooms);
router.get('/', getAllRooms); 

export default router;
