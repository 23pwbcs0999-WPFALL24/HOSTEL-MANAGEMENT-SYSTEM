import room from "../models/room.js";
import { Op, col } from "sequelize";

const createRoom = async (req, res) => {
  try {
    // checking if all the required fields are provided or not
    const { block, floor, room_type } = req.body;
    if (!block || !floor || !room_type) {
      console.error("Missing required fields for room creation");
      return res.status(400).json({ error: "All fields are required" });
    }

    // calculating max capacity based on the room type selected
    let max_capacity =
      room_type === "1-Seater"
        ? 1
        : room_type === "2-Seater"
        ? 2
        : null;
    if (!max_capacity) {
      console.error("Invalid room type");
      return res
        .status(400)
        .json({ error: "Invalid room type. Choose either 1-Seater or 2-Seater" });
    }

    // adding new room
    const newRoom = await room.create({
      block,
      floor,
      room_type,
      max_capacity,
      current_occupancy: 0,
    });

    console.log(
      `New room added successfully with Room Id: ${newRoom.room_id}, Block: ${block}, Floor: ${floor}, Room type: ${room_type}`
    );
    return res.status(200).json({
      message: "Room added successfully",
      room: newRoom,
    });
  } catch (error) {
    // error handling
    console.error("Failed to add room: ", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getAvailableRooms = async (req, res) => {
  try {
    // Equivalent SQL:
    // SELECT * FROM rooms
    // WHERE (room_type = '1-Seater' AND current_occupancy = 0)
    //    OR (room_type = '2-Seater' AND current_occupancy < max_capacity)
    const availableRooms = await room.findAll({
      where: {
        [Op.or]: [
          {
            room_type: "1-Seater",
            current_occupancy: 0,
          },
          {
            room_type: "2-Seater",
            current_occupancy: {
              [Op.lt]: col("max_capacity"),
            },
          },
        ],
      },
    });

    // checking if there are any available rooms and returning response accordingly
    if (availableRooms.length === 0) {
      console.log("No rooms available");
      return res.status(200).json({
        message: "No rooms available",
        rooms: [],
      });
    }

    console.log(`${availableRooms.length} Rooms available`);
    return res.status(200).json({
      message: "Available rooms fetched successfully",
      rooms: availableRooms,
    });
  } catch (error) {
    console.error("Unable to fetch available rooms: ", error.message);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

// New function to get all rooms for GET /api/rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await room.findAll();
    return res.status(200).json(rooms);
  } catch (error) {
    console.error("Failed to fetch all rooms: ", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getEmptyRooms = async (req, res) => {
  try {
    // Equivalent SQL:
    // SELECT * FROM rooms
    // WHERE current_occupancy = 0
    //   AND (block = ?)
    //   AND (floor = ?)
    //   AND (max_capacity = ?)
    const { block, floor, occupancy } = req.query;
    const where = { current_occupancy: 0 };
    if (block) where.block = block;
    if (floor) where.floor = floor;
    if (occupancy) where.max_capacity = occupancy;

    const emptyRooms = await room.findAll({ where });
    return res.status(200).json(emptyRooms);
  } catch (error) {
    console.error("Failed to fetch empty rooms: ", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { getAvailableRooms, createRoom, getAllRooms, getEmptyRooms };
