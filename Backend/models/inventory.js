import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Inventory = sequelize.define('Inventory', {
    item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    room_id: {
        type:DataTypes.INTEGER
    },
    item_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    item_condition: {
        type: DataTypes.ENUM('Good', 'Damaged', 'Need Repair'),
        allowNull: false
    },
    last_checked_date: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: "Inventories",
    timestamps: false
});

export default Inventory;