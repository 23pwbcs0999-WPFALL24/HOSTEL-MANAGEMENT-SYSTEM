import  allocation from "../models/allocation.js"
import  student from "../models/student.js"
import { Op } from "sequelize";

const createStudent = async(req, res) => {
    try {
        const {student_name, roll_number, cnic, phone_number, department, semester} = req.body;

        if(!student_name || !roll_number || !cnic || !phone_number || !department || !semester){
            console.error("Missing required fields for adding a student");
            return res.status(400).json({ error: "All fields are required for adding a student" });
        }

        const Student = await student.create({
            student_name,
            roll_number,
            cnic,
            phone_number,
            department,
            semester
        });
        console.log("Student added successfully: ", Student);
        res.status(200).json(
            {
                message: "Student added successfully",
                student: Student
            }
        );
    } catch (error) {
        console.error("Error adding student: ", error.message);
        res.status(400).json({error: "Error adding student"});
    }
}

const getUnallocatedStudents = async(req, res) => {
    try {
        const allocatedIds = await allocation.findAll({
            attributes: ['student_id']
        });

        const allocatedStudentIds = allocatedIds.map(a => a.student_id);

        const unallocatedStudents = await student.findAll({
            where:{
                student_id: {
                    [Op.notIn]: allocatedStudentIds
                }
            }
        });

        // checking if there are any unallocated students based on which we will be returning the response
        if(unallocatedStudents.length === 0){
            console.log("No unallocated students found");
            return res.status(200).json({
                message: "No unallocated students",
                students: []
            });
        }

        console.log(`Found ${unallocatedStudents.length} unalloacted students`);
        res.status(200).json({
            message: "unallocated students fetches successfully",
            students: unallocatedStudents
        });

    } catch (error) {
        console.error("Error fetching unallocated students: ", error.message);
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

export {createStudent, getUnallocatedStudents};