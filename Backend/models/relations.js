import sequelize from '../config/database.js';
import Student from "./student.js";
import Room from "./room.js";
// import Warden from "./warden.js";
import Allocation from "./allocation.js";
import Inventory from "./inventory.js";
import Visitor from "./visitor.js";

// Allocation: student_id and room_id
Student.hasOne(Allocation, { foreignKey: 'student_id' });
Allocation.belongsTo(Student, { foreignKey: 'student_id' });

Room.hasMany(Allocation, { foreignKey: 'room_id' });
Allocation.belongsTo(Room, { foreignKey: 'room_id' });

// Visitor: student_id
Student.hasMany(Visitor, { foreignKey: 'student_id' });
Visitor.belongsTo(Student, { foreignKey: 'student_id' });

// Inventory: room_id
Room.hasMany(Inventory, { foreignKey: 'room_id' });
Inventory.belongsTo(Room, { foreignKey: 'room_id' });

// Warden: block
// Warden.hasOne(Room, { foreignKey: 'block', sourceKey: 'block_assigned' });

export { sequelize, Student, Room, Allocation, Visitor, Inventory };