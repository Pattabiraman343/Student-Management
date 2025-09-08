
// db.js
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "student_management_cp3y", // Database name
  "student_management_cp3y_user", // Username
  "RRFv1BHKxybWdrm7wK5TDfm7qL0WcimN", // 🔑 Replace with your Render DB password
  {
    host: "dpg-d2v4ckp5pdvs73b1na5g-a.singapore-postgres.render.com", // External hostname
    port: 5432,
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
