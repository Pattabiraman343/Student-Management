import express from "express";
import multer from "multer";
import path from "path";
import role from "../middlewares/role.js";
import auth from "../middlewares/Auth.js";
import {
  addStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  exportStudents,
  importStudents,
  getDashboardStats,
  getAllGradesSections,
} from "../controllers/StudentController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Multer config for Excel uploads
const uploadExcel = multer({ dest: "uploads/" });


// Admin only
router.post("/", auth, role(["Admin"]), upload.single("image"), addStudent);
router.put("/:id", auth, role(["Admin"]), upload.single("image"), updateStudent);
router.delete("/:id", auth, role(["Admin"]), deleteStudent);

// Dashboard (Admin only)
router.get("/dashboard", auth, role(["Admin"]), getDashboardStats);

// Classes (Admin + Teacher)
router.get("/classes", auth, role(["Admin", "Teacher"]), getAllGradesSections);

// Admin + Teacher
router.get("/", auth, role(["Admin", "Teacher"]), getStudents);

// Export (Admin only)
router.get("/export", auth, role(["Admin"]), exportStudents);

// Import (Admin only)
router.post("/import", auth, role(["Admin"]), uploadExcel.single("file"), importStudents);

export default router;
