import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Visitor = sequelize.define('Visitor', {
    visitor_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
    },
    student_id: {
        type: DataTypes.INTEGER
    },
    visitor_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    relation: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    visit_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: "visitors",
    timestamps: false
});

export default Visitor;
