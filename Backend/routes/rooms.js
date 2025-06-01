// import express from "express";
// import {createRoom, getAvailableRooms} from "../controllers/roomController.js";

// const router = express.Router();

// router.post('/', createRoom);
// router.get('/available', getAvailableRooms);

// export default router;
import express from "express";
import { createRoom, getAvailableRooms, getAllRooms } from "../controllers/roomController.js";

const router = express.Router();

router.post('/', createRoom);
router.get('/available', getAvailableRooms);
router.get('/', getAllRooms);  // Add this!

export default router;
