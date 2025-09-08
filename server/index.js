import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";   // ✅ Needed for __dirname
import sequelize from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/students.js";
import auditLogRoutes from "./routes/auditLogRoutes.js";
import "./models/associations.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

//  Serve uploaded files correctly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

async function start() {
  try {
    await sequelize.authenticate();
    console.log(" Database connected");

    await sequelize.sync({ alter: true });
    console.log(" Tables synced");

    app.listen(5000, () =>
      console.log(" Server running on http://localhost:5000")
    );
  } catch (err) {
    console.error(" Error starting server:", err);
  }
}

start();
