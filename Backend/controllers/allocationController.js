import  allocation from "../models/allocation.js"
import  student from "../models/student.js"
import room from "../models/room.js";

const allocateRoom = async (req, res) => {
    try {
        const { student_id, room_id, allocation_date} = req.body;

        //checking for all the required fields
        if(!student_id || !room_id || !allocation_date){
            console.error("Missing required fields");
            return res.status(400).json({ error: "All fields are required"});
        }

        //checking if the student has already been allocated a room
        const existingAllocation = await allocation.findOne({ where: {student_id}});
        if(existingAllocation){
            console.error("Student has already been allocated a room");
            return res.status(400).json({ error: "Student has already been allocated a room"});
        }

        // checking if rooms exists and has capacity
        const roomExists = await room.findOne({ where: {room_id}});
        if(!roomExists){
            console.error("Room does nor exists with Id: ", room_id);
            return res.status(400).json({ error: "Room not found"});
        }

        if(roomExists.current_occupancy >= roomExists.max_capacity){
            console.error(`Room with Id: ${room_id} is full`);
            return res.status(400).json({ error: "Room is full" });
        }

        // create new allocation
        const newAllocation = await allocation.create({
            student_id,
            room_id,
            allocation_date
        });

        //update room occupancy
        await room.update(
            {current_occupancy: room.current_occupancy + 1},
            {where: {room_id}}
        );

        console.log(`Room ${room_id} allocated to student ${student_id} on date ${allocation_date}`);
        return res.status(200).json(
            {
                message: "Room allocated successfully",
                allocation: newAllocation
            }
        );
    } catch (error) {
        console.error("Error allocating room: ", error.message);
        return res.status(500).json({message: "Internal server error"});
    }
};

export default allocateRoom;