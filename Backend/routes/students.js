
import express from "express";
import {
  createStudent,
  getUnallocatedStudents,
  getAllStudents,
} from "../controllers/studentController.js";

const router = express.Router();

router.get("/", getAllStudents);
router.get("/unallocated", getUnallocatedStudents);
router.post("/", createStudent);

export default router;
