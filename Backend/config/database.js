import Sequelize from "sequelize"
import dotenv from "dotenv"
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// custom function to store logs in a file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logStream = fs.createWriteStream(path.join(__dirname, 'sequelize.log'), { flags: 'a' });

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: (msg) => {
      console.log(msg);
      logStream.write(`${new Date().toISOString()} - ${msg}\n`);
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export default sequelize;


