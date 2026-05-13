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
    console.error('Error fetching visitors:', error.message);
    res.status(500).json({ message: 'Failed to fetch visitors' });
  }
};

// Delete a visitor
export const deleteVisitor = async (req, res) => {
  try {
    const { id } = req.params;
    const found = await visitor.findByPk(id);
    if (!found) return res.status(404).json({ error: 'Visitor not found' });
    await found.destroy();
    return res.status(200).json({ message: 'Visitor deleted successfully' });
  } catch (error) {
    console.error('Error deleting visitor:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a visitor
export const updateVisitor = async (req, res) => {
  try {
    const { id } = req.params;
    const found = await visitor.findByPk(id);
    if (!found) return res.status(404).json({ error: 'Visitor not found' });
    const { visitor_name, relation, visit_date } = req.body;
    await found.update({ visitor_name: visitor_name || found.visitor_name, relation: relation || found.relation, visit_date: visit_date || found.visit_date });
    return res.status(200).json({ message: 'Visitor updated successfully', visitor: found });
  } catch (error) {
    console.error('Error updating visitor:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
