import express from "express";
import { sendOtpController, verifyOtpController } from "../controllers/otp.controller.js";
import { registerUser, loginUser, getAllUsersController, checkUsernameController } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-otp", sendOtpController);
router.post("/verify-otp", verifyOtpController);
// get all users
router.get("/all", getAllUsersController);
router.get("/check/:username", checkUsernameController);

export default router;
