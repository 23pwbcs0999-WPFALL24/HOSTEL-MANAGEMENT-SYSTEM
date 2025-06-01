import express from "express";
import allocateRoom from "../controllers/allocationController.js";

const router = express.Router()

router.post('/', allocateRoom);

export default router;