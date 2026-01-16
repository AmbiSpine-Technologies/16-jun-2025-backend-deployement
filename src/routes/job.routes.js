import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
  getFeaturedJobs,
  toggleJobStatus,
} from "../controllers/job.controller.js";
import {
  createJobApplication,
  getMyApplications,
  getJobApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
} from "../controllers/jobApplication.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes (no auth required)
router.get("/all", getAllJobs);
router.get("/featured", getFeaturedJobs);
router.get("/:id", getJobById);

// Protected routes (auth required)
router.post("/create", authMiddleware, createJob);
router.get("/my/jobs", authMiddleware, getMyJobs);
router.put("/update/:id", authMiddleware, updateJob);
router.delete("/delete/:id", authMiddleware, deleteJob);
router.patch("/toggle-status/:id", authMiddleware, toggleJobStatus);

// Job Applications routes
router.post("/:id/apply", authMiddleware, createJobApplication);
router.get("/applications/my", authMiddleware, getMyApplications);
router.get("/:id/applications", authMiddleware, getJobApplications);
router.get("/applications/:id", authMiddleware, getApplicationById);
router.put("/applications/:id/status", authMiddleware, updateApplicationStatus);
router.delete("/applications/:id/withdraw", authMiddleware, withdrawApplication);

export default router;
