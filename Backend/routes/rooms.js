
import express from "express";
import { createRoom, getAvailableRooms, getAllRooms } from "../controllers/roomController.js";

const router = express.Router();

router.post('/', createRoom);
router.get('/available', getAvailableRooms);
router.get('/', getAllRooms); 

export default router;
