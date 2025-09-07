import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "student_management", // DB name
  "postgres",           // DB user
  "pattabi",      // DB password
  {
    host: "localhost",
    dialect: "postgres",
    logging: false,
  }
);

export default sequelize;
