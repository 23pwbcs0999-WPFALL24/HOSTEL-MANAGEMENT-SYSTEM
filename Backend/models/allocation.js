import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Allocation = sequelize.define('Allocation', {
    allocation_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    student_id: {
        type: DataTypes.INTEGER
    },
    room_id: {
        type: DataTypes.INTEGER
    },
    allocation_date: {
        type: DataTypes.DATE
    }
}, {
    tableName: "allocations",
    timestamps: false
});

export default Allocation;
