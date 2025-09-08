import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // load env variables

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Render requires SSL
      },
    },
  }
);

export default sequelize;
