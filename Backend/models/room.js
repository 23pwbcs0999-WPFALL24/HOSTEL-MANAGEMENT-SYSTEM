import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Room = sequelize.define('Room', {
    room_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    block: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    floor: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    room_type: {
        type: DataTypes.ENUM('1-Seater', '2-Seater'),
        allowNull: false
    },
    current_occupancy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    max_capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "rooms",
    timestamps: false
});

export default Room;
