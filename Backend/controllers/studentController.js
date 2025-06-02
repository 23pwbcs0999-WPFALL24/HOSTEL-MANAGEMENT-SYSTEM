import allocation from "../models/allocation.js";
import student from "../models/student.js";
import { Op } from "sequelize";

// Create new student
const createStudent = async (req, res) => {
  try {
    const { student_name, roll_number, cnic, phone_number, department, semester } = req.body;

    if (!student_name || !roll_number || !cnic || !phone_number || !department || !semester) {
      console.error("Missing required fields for adding a student");
      return res.status(400).json({ error: "All fields are required for adding a student" });
    }

    const studentInstance = await student.create({
      student_name,
      roll_number,
      cnic,
      phone_number,
      department,
      semester,
    });

    console.log("Student added successfully: ", studentInstance);
    return res.status(200).json({
      message: "Student added successfully",
      student: studentInstance,
    });
  } catch (error) {
    console.error("Error adding student: ", error.message);
    return res.status(500).json({ error: "Error adding student" });
  }
};

// Get all students
const getAllStudents = async (req, res) => {
  try {
    // Equivalent SQL:
    // SELECT * FROM students
    const students = await student.findAll();
    return res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students: ", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Get unallocated students
const getUnallocatedStudents = async (req, res) => {
  try {
    // Equivalent SQL:
    // SELECT * FROM students
    // WHERE student_id NOT IN (SELECT student_id FROM allocations)
    const allocatedIds = await allocation.findAll({
      attributes: ["student_id"],
    });

    const allocatedStudentIds = allocatedIds.map((a) => a.student_id);

    const unallocatedStudents = await student.findAll({
      where: {
        student_id: {
          [Op.notIn]: allocatedStudentIds.length ? allocatedStudentIds : [0],
        },
      },
    });

    console.log(`Found ${unallocatedStudents.length} unallocated students`);
    return res.status(200).json({
      message: "Unallocated students fetched successfully",
      students: unallocatedStudents,
    });
  } catch (error) {
    console.error("Error fetching unallocated students: ", error.message);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export { createStudent, getUnallocatedStudents, getAllStudents };

