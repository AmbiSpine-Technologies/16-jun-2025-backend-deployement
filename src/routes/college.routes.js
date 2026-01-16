import express from "express";
import {
  createCollege,
  getCollegeById,
  updateCollege,
  getMyColleges,
  getAllColleges,
} from "../controllers/college.controller.js";
import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  bulkUploadStudents,
} from "../controllers/collegeStudent.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../utils/upload.js"
const router = express.Router();

// College routes
router.post("/create", authMiddleware, upload.fields([
   { name: "logo", maxCount: 1 },
    { name: "verificationDoc", maxCount: 1 },
]), createCollege);
router.get("/colleges", getAllColleges);
router.get("/my/colleges", authMiddleware, getMyColleges);
router.get("/:id", getCollegeById);
router.put("/update/:id", authMiddleware, updateCollege);

// Student routes (nested under college)
router.post("/:collegeId/students", authMiddleware, createStudent);
router.get("/:collegeId/students", authMiddleware, getStudents);
router.get("/students/:id", getStudentById);
router.put("/:collegeId/students/:id", authMiddleware, updateStudent);
router.delete("/:collegeId/students/:id", authMiddleware, deleteStudent);
router.post("/:collegeId/students/bulk-upload", authMiddleware, bulkUploadStudents);

export default router;


