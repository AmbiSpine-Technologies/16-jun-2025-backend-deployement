import express from "express";
import {
  createCompany,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getMyCompanies,
  getAllCompanies,
} from "../controllers/company.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from '../utils/upload.js';
const router = express.Router();

// Public routes (no auth required)
router.get("/all", getAllCompanies);
router.get("/:id", getCompanyById);

// Protected routes (auth required)
router.post("/create", authMiddleware, upload.fields([
   { name: "logo", maxCount: 1 },
    { name: "verificationDoc", maxCount: 1 },
]), createCompany);

router.get("/my/companies", authMiddleware, getMyCompanies);
router.put("/update/:id", authMiddleware, updateCompany);
router.delete("/delete/:id", authMiddleware, deleteCompany);

export default router;


