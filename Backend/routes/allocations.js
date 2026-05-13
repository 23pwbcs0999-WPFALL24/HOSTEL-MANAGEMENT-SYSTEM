import express from "express";
import { allocateRoom, getAllocations, deleteAllocation } from "../controllers/allocationController.js";

const router = express.Router();

router.get("/", getAllocations);
router.post("/", allocateRoom);
router.delete("/:id", deleteAllocation);

export default router;