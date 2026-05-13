import express from "express";
import { createStudent, getUnallocatedStudents, getAllStudents, deleteStudent, updateStudent } from "../controllers/studentController.js";

const router = express.Router();

router.get("/", getAllStudents);
router.get("/unallocated", getUnallocatedStudents);
router.post("/", createStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;
