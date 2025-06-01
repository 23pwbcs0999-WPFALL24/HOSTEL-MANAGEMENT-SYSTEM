import  visitor from "../models/visitor.js"
import  student from "../models/student.js"

const addVisitor = async (req, res) => {
    try {
        const {student_id, visitor_name, relation, visit_date} = req.body;

        // checking if all the fields are provided
        if(!student_id || !visitor_name || !relation || !visit_date){
            console.error("Missing required fields");
            return res.status(400).json({ error: "All fields are required"});
        }

        // checking if the students exists
        const studentExists = await student.findByPk(student_id);
        if(!studentExists){
            console.error("Student does not exists with Id: ", student_id);
            return res.status(400).json({error: "Student not found with provided Id"});
        }

        const newVisitor = await visitor.create({
            student_id,
            visitor_name,
            relation,
            visit_date
        });

        console.log(`New visitor with name ${visitor_name} visited student ${student_id}`);
        return res.status(200).json(
            {
                message: "New visitor added successfully",
                visitor: newVisitor
            }
        );
    } catch (error) {
        console.error("Error adding new visitor ", error.message);
        return res.status(500).json({message: "Internal server error"});
    }
};

export default addVisitor;