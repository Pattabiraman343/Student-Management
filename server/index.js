import express from "express";
import cors from "cors";
import sequelize from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/students.js";
import auditLogRoutes from "./routes/auditLogRoutes.js";
import "./models/associations.js";  

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/audit-logs", auditLogRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

async function start() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
    await sequelize.sync({ alter: true });
    console.log("✅ Tables synced");

    app.listen(5000, () => console.log("Server running on port 5000"));
  } catch(err){
    console.error(err);
  }
}

start();
