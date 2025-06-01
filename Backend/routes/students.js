import express from "express";
import {createStudent, getUnallocatedStudents} from "../controllers/studentController.js";

const router = express.Router();

router.post('/', createStudent);
router.get('/unallocated', getUnallocatedStudents);

export default router;