// models/AuditLog.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const AuditLog = sequelize.define("AuditLog", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: true,   // sequelize won’t force NOT NULL
  }
  
  ,
  userRole: {
    type: DataTypes.STRING,
    allowNull: true,   //  Sequelize won’t force NOT NULL
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: true, // in case log is not tied to a student
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  changes: {
    type: DataTypes.JSON,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default AuditLog;
