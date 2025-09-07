import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Student = sequelize.define("Student", {
    name: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER },
    grade: { type: DataTypes.STRING, allowNull: true },   // allow null
    section: { type: DataTypes.STRING, allowNull: true }, // allow null
    gender: {
      type: DataTypes.ENUM('Male','Female','Other'),
      allowNull: false
    },
    image: { type: DataTypes.STRING }
  });
  

export default Student;
