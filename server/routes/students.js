import express from "express";
// import auth from "../middlewares/auth.js";
import role from "../middlewares/role.js";
import auth from "../middlewares/Auth.js"
import multer from "multer";
import { addStudent, getStudents, updateStudent, deleteStudent } from "../controllers/StudentController.js";
import { exportStudents, importStudents,getDashboardStats,  getAllGradesSections, } from "../controllers/StudentController.js";

const uploadExcel = multer({ dest: "uploads/" });



const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Admin only
router.post("/", auth, role(["Admin"]), upload.single("image"), addStudent);
router.put("/:id", auth, role(["Admin"]), upload.single("image"), updateStudent);
router.delete("/:id", auth, role(["Admin"]), deleteStudent);
// Dashboard (Admin only)
router.get("/dashboard", auth, role(["Admin"]), getDashboardStats);
router.get("/classes", auth, role(["Admin","Teacher"]), getAllGradesSections);

// Admin & Teacher
router.get("/", auth, role(["Admin","Teacher"]), getStudents);

// Admin & Teacher
// Admin & Teacher
// router.get("/classes", auth, role(["Admin","Teacher"]), getAllClasses);

router.get("/export", auth, role(["Admin"]), exportStudents);

// Import (Admin only)
router.post("/import", auth, role(["Admin"]), uploadExcel.single("file"), importStudents);
export default router;
