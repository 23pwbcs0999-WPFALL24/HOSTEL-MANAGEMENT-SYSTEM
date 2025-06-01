import room from "../models/room.js";
import { Op, col } from "sequelize";

const createRoom = async (req, res) => {
    try {
        // checking if all the required fields are provided or not
        const { block, floor, room_type } = req.body;
        if(!block || !floor || !room_type){
            console.error("Missing required fields for room creation");
            return res.status(400).json({error: "All fields are required"});
        }

        // calculating max capacity based on the room type selected
        let max_capacity = room_type === '1-Seater'? 1 : room_type === '2-Seater'? 2 : null;
        if(!max_capacity){
            console.error("Invalid room type");
            res.status(400).json({ error: "Invalid room type. Choose either 1-seater or 2-seater"});
        }

        // adding new room
        const newRoom = await room.create({
            block,
            floor,
            room_type,
            max_capacity,
            current_occupancy: 0
        });

        console.log(`New room added successfully with Room Id: ${newRoom.room_id}, Block: ${block}, Floor: ${floor}, Room type: ${room_type}`);
        return res.status(200).json(
            { 
                message: "Room added successfully",
                room: newRoom
            }
        );
    } catch (error) {
        // error handling
        console.error("Failed to add room: ", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const getAvailableRooms = async (req, res) => {
    try {
        const availbleRooms = await room.findAll({
            where: {
                [Op.or]: [
                    // 1-seater with zero occupancy
                    {
                        room_type: '1-Seater',
                        current_occupancy: 0
                    },

                    // 2-Seater with available capacity
                    {
                        room_type: '2-Seater',
                        current_occupancy:{
                            [Op.lt]: col('max_capacity')
                        }
                    }
                ]
            }
        });

        // checking if there are any available rooms and returning response accordingly
        if(getAvailableRooms.length === 0){
            console.log("No rooms available");
            return res.status(200).json({
                message: "No rooms available",
                rooms: []
            });
        }

        console.log(`${availbleRooms.length} Rooms avaiable`)
        res.status(200).json({
            message: "Available rooms fetched successfully",
            rooms: availbleRooms
        });
    } catch (error) {
        console.error("Unable to fetch available rooms: ", error.message);
        res.status(500).json({
            error: "Internal server error"
        });
    }
};

export {getAvailableRooms, createRoom};