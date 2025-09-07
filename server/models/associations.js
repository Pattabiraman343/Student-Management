import AuditLog from "./AuditLogs.js";   // include .js
import Student from "./Student.js";
import User from "./User.js";

AuditLog.belongsTo(Student, { foreignKey: "studentId", as: "student" });
AuditLog.belongsTo(User, { foreignKey: "userId", as: "user" });

Student.hasMany(AuditLog, { foreignKey: "studentId", as: "logs" });
User.hasMany(AuditLog, { foreignKey: "userId", as: "logs" });

export { AuditLog, Student, User };
