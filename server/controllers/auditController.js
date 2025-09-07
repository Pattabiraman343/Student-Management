import AuditLog from "../models/AuditLogs.js";
import Student from "../models/Student.js";
import User from "../models/User.js";

// Get all audit logs (Admins only)
export const getAuditLogs = async (req, res) => {
    try {
      const logs = await AuditLog.findAll({
        include: [
          { model: Student, as: "student", attributes: ["id", "name", "grade", "section"] },
          { model: User, as: "user", attributes: ["id", "username", "role"] }
        ],
        order: [["timestamp", "DESC"]],
      });
  
      res.json(logs);
    } catch (err) {
      console.error("Error fetching audit logs:", err);
      res.status(500).json({ message: "Error fetching audit logs" });
    }
  };
  
