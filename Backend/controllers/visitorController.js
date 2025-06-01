import visitor from "../models/visitor.js";
import student from "../models/student.js";

// Create a new visitor
export const addVisitor = async (req, res) => {
  try {
    const { student_id, visitor_name, relation, visit_date } = req.body;

    if (!student_id || !visitor_name || !relation || !visit_date) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const studentExists = await student.findByPk(student_id);
    if (!studentExists) {
      return res.status(400).json({ error: "Student not found with provided Id" });
    }

    const newVisitor = await visitor.create({ student_id, visitor_name, relation, visit_date });

    return res.status(200).json({
      message: "New visitor added successfully",
      visitor: newVisitor
    });
  } catch (error) {
    console.error("Error adding new visitor:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch all visitors
export const getVisitors = async (req, res) => {
  try {
    const visitors = await visitor.findAll();
    res.status(200).json(visitors);
  } catch (error) {
    console.error("Error fetching visitors:", error.message);
    res.status(500).json({ message: "Failed to fetch visitors" });
  }
};
