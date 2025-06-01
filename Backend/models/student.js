import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Student = sequelize.define('Student', {
    student_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    student_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    roll_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    cnic: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    phone_number: {
        type: DataTypes.STRING(11),
        allowNull: false
    },
    department: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    semester: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: "students",
    timestamps: false
});

export default Student;
