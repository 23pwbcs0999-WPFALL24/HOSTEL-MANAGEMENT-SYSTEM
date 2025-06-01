import Inventory from "../models/inventory.js";
import Room from "../models/room.js";

export const addInventoryItem = async (req, res) => {
    try {
        const { room_id, item_name, item_condition, last_checked_date } = req.body;


        if (!room_id || !item_name || !item_condition || !last_checked_date) {
            return res.status(400).json({ 
                success: false,
                error: "All fields are required: room_id, item_name, item_condition, last_checked_date"
            });
        }


        if (isNaN(new Date(last_checked_date).getTime())) {
            return res.status(400).json({
                success: false,
                error: "Invalid date format. Please use YYYY-MM-DD"
            });
        }

        const room = await Room.findByPk(room_id);
        if (!room) {
            return res.status(404).json({
                success: false,
                error: "Room not found"
            });
        }

        // Create new inventory item
        const newItem = await Inventory.create({
            room_id,
            item_name,
            item_condition,
            last_checked_date: new Date(last_checked_date)
        });

        return res.status(201).json({
            success: true,
            message: "Inventory item added successfully",
            data: newItem
        });

    } catch (error) {
        console.error("Inventory error:", error);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getInventory = async (req, res) => {
    try {
        const inventory = await Inventory.findAll({
            include: [{
                model: Room,
                attributes: ['room_id', 'block', 'floor']
            }],
            order: [['last_checked_date', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: inventory
        });
    } catch (error) {
        console.error("Fetch inventory error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch inventory",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};