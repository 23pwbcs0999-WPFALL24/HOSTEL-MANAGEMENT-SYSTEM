import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database.js";


import './models/relations.js';

import students from "./routes/students.js";
import rooms from "./routes/rooms.js";
import allocations from "./routes/allocations.js";
import inventories from "./routes/inventories.js";
import visitors from "./routes/visitors.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/students', students);
app.use('/api/rooms', rooms);
app.use('/api/allocations', allocations);
app.use('/api/inventory', inventories);
app.use('/api/visitors', visitors);

app.get('/', (req, res) => {
    res.send("Hostel Management Server is running");
});

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connection successful");

        if (process.env.NODE_ENV === "development") {
            await sequelize.sync({ force: true }); 
            console.log("Tables dropped and recreated in development mode");
        } else {
            await sequelize.sync({ alter: true });
            console.log("Tables synced");
        }

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect or sync:", error.message);
        process.exit(1);
    }
};

startServer();
