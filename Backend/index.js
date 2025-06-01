import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import sequelize from "./config/database.js";
// import student from "./models/student.js"
// import room from "./models/room.js"
// import allocation from "./models/allocation.js"
// import inventory from "./models/inventory.js"
// import visitor from "./models/visitor.js"
import './models/relations.js';
import students from "./routes/students.js"
import rooms from "./routes/rooms.js"
import allocations from "./routes/allocations.js"
import inventories from "./routes/inventories.js"
import visitors from "./routes/visitors.js"


//loading environment variables
dotenv.config(); 

const PORT = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(cors());
app.use(express.json())

// Adding routes
app.use('/api/students', students);
app.use('/api/rooms', rooms);
app.use('/api/allocations', allocations);
app.use('/api/visitors', visitors);
app.use('/api/inventory', inventories);

// Root route
app.use('/', (req, res) => {
    res.send("Hostel Management Server is running");
});

// Sequelize sync and start server
sequelize.authenticate()
    .then(() => {
        console.log("Database connection successfull");
        return sequelize.sync({alter: true});
    })
    .then(() => {
        console.log("Database synced");
        app.listen(PORT, () => {
            console.log(`Server started at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect or sync: ", err.message);
        process.exit(1);
    });


