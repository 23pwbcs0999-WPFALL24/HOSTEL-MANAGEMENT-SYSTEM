import Inventory from "../models/inventory.js";
import Room from "../models/room.js";
import { Op } from "sequelize";

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
        // Equivalent SQL:
        // SELECT * FROM inventories
        // JOIN rooms ON inventories.room_id = rooms.room_id
        // WHERE (item_condition = ?)
        //   AND (room_id = ?)
        //   AND (last_checked_date BETWEEN ? AND ?)
        const { 
          item_condition, 
          from_date, 
          to_date,
          room_id
        } = req.query;

        // Build dynamic where condition for filtering inventory
        const inventoryWhere = {};
        if (item_condition) inventoryWhere.item_condition = item_condition;

        if (room_id) inventoryWhere.room_id = room_id;

        // Date filter for last_checked_date
        if (from_date && to_date) {
            inventoryWhere.last_checked_date = {
                [Op.between]: [new Date(from_date), new Date(to_date)]
            };
        } else if (from_date) {
            inventoryWhere.last_checked_date = {
                [Op.gte]: new Date(from_date)
            };
        } else if (to_date) {
            inventoryWhere.last_checked_date = {
                [Op.lte]: new Date(to_date)
            };
        }

        const inventory = await Inventory.findAll({
            where: inventoryWhere,
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
