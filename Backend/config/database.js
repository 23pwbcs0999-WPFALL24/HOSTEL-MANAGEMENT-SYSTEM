import Sequelize from "sequelize";
import dotenv from "dotenv";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logStream = fs.createWriteStream(path.join(__dirname, 'sequelize.log'), { flags: 'a' });

dotenv.config();

const filterLogs = (msg) => {
  // Skip Sequelize internal queries
  const lowerMsg = msg.toLowerCase();
  if (
    lowerMsg.includes("information_schema") ||
    lowerMsg.startsWith("show full columns") ||
    lowerMsg.startsWith("select constraint_name") ||
    lowerMsg.includes("select 1+1")
  ) {
    return;
  }

  console.log(msg); // Show clean SQL
  logStream.write(`${new Date().toISOString()} - ${msg}\n`);
};

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT, 
    logging: filterLogs,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);
console.log("Connecting to DB:", process.env.DB_NAME, "@", process.env.DB_HOST);

export default sequelize;
// https://railway.com/project/6444f6c1-595f-426c-b399-2669f5a7ecf3/service/d0bb672c-7c17-49a7-947f-d5f647a95494/data?environmentId=4fe156f9-3d81-402a-9c89-246be594dd53