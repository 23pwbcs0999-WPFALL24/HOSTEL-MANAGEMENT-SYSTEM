import sequelize from "../config/database";
import DataTypes from "sequelize";

const Warden = sequelize.define('Warden', {
    warden_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    warden_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    phone_number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    block_assigned: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "wardens",
    timestamp: false
});

export default Warden;