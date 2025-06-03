import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "../config/database.js";
import '../models/relations.js';

import students from "../routes/students.js";
import rooms from "../routes/rooms.js";
import allocations from "../routes/allocations.js";
import inventories from "../routes/inventories.js";
import visitors from "../routes/visitors.js";

dotenv.config();
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

// No app.listen() here!

export default app;
