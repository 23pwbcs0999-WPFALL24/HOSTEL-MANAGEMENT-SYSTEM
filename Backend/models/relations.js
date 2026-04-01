import sequelize from '../config/database.js';
import Student from "./student.js";
import Room from "./room.js";
import Allocation from "./allocation.js";
import Inventory from "./inventory.js";
import Visitor from "./visitor.js";


// One-to-One: Each Student can have one Allocation (room assignment)
Student.hasOne(Allocation, { foreignKey: 'student_id' }); // 1 Student -> 1 Allocation
Allocation.belongsTo(Student, { foreignKey: 'student_id' }); // Allocation belongs to 1 Student

// One-to-Many: Each Room can have many Allocations (many students can be assigned to a room)
Room.hasMany(Allocation, { foreignKey: 'room_id' }); // 1 Room -> Many Allocations
Allocation.belongsTo(Room, { foreignKey: 'room_id' }); // Allocation belongs to 1 Room

// One-to-Many: Each Student can have many Visitors
Student.hasMany(Visitor, { foreignKey: 'student_id' }); // 1 Student -> Many Visitors
Visitor.belongsTo(Student, { foreignKey: 'student_id' }); // Visitor belongs to 1 Student

// One-to-Many: Each Room can have many Inventory items
Room.hasMany(Inventory, { foreignKey: 'room_id' }); // 1 Room -> Many Inventory items
Inventory.belongsTo(Room, { foreignKey: 'room_id' }); // Inventory item belongs to 1 Room



export { sequelize, Student, Room, Allocation, Visitor, Inventory };
