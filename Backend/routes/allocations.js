 import express from "express";
import { allocateRoom, getAllocations } from "../controllers/allocationController.js";

const router = express.Router();

router.post("/", allocateRoom);
router.get("/", getAllocations);

export default router;