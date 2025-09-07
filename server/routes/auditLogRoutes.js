import express from "express";
import { getAuditLogs } from "../controllers/auditController.js";
import auth from "../middlewares/Auth.js";
import role from "../middlewares/role.js";

const router = express.Router();

// Only Admins can view logs
router.get("/", auth, role("Admin"), getAuditLogs);

export default router;
