import { Allocation, Student, Room } from "../models/relations.js";

const allocateRoom = async (req, res) => {
  try {
    const { student_id, room_id, allocation_date } = req.body;

    if (!student_id || !room_id || !allocation_date) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Find student by ID
    let student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: "Student not found" });
    }

    // Check if student already has a room
    const existingAllocation = await Allocation.findOne({
      where: { student_id: student.student_id }
    });
    if (existingAllocation) {
      return res.status(400).json({ error: "Student has already been allocated a room" });
    }

    // Check room availability
    const room = await Room.findByPk(room_id);
    if (!room) {
      return res.status(400).json({ error: "Room not found" });
    }

    if (room.current_occupancy >= room.max_capacity) {
      return res.status(400).json({ error: "Room is full" });
    }

    // Create allocation
    const newAllocation = await Allocation.create({
      student_id: student.student_id,
      room_id,
      allocation_date
    });

    // Update occupancy
    await Room.update(
      { current_occupancy: room.current_occupancy + 1 },
      { where: { room_id } }
    );

    return res.status(200).json({
      message: "Room allocated successfully",
      allocation: newAllocation,
      student
    });

  } catch (error) {
    console.error("Error allocating room:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getAllocations = async (req, res) => {
  try {
    const allocations = await Allocation.findAll({
      include: [
        {
          model: Student,
          attributes: ['student_id', 'student_name']
        },
        {
          model: Room,
          attributes: ['room_id', 'max_capacity', 'current_occupancy']
        }
      ]
    });

    return res.status(200).json(allocations);
  } catch (error) {
    console.error("Error fetching allocations:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { allocateRoom, getAllocations };