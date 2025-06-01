import  inventory from "../models/inventory.js"
import  room from "../models/room.js"

const addInventoryItem = async (req, res) => {
    try {
        // checking if all the required fields are provided
        const {room_id, item_name, item_condition, last_checked_date} = req.body;

        if(!room_id || !item_name || !item_condition || !last_checked_date){
            console.error("Missing required fields for room creation");
            return res.status(400).json({error: "All fields are required"});
        }

        // adding item to room
        const Item = await inventory.create({
            room_id,
            item_name,
            item_condition,
            last_checked_date
        });

        console.log(`Inventory item added ${item_name} to room ${room_id}`);
        return res.status(200).json(
            { 
                message: "Successfully added item to room",
                item: Item
            }
        );
    } catch (error) {
        console.error("Error adding item to room: ", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export default addInventoryItem;