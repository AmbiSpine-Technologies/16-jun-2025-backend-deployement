import express from "express";
import { sendOtpController, verifyOtpController, HRorTPOOtpController, HRorTPOverifyOtpController } from "../controllers/otp.controller.js";
import { registerUser, loginUser, getAllUsersController, checkUsernameController, googleOAuthController, googleSignupController , googleLoginController  } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-otp", sendOtpController);
router.post("/verify-otp", verifyOtpController);
router.post("/verify-otp", verifyOtpController);
router.post("/hrtpo-sent-otp", authMiddleware, HRorTPOOtpController);
// router.post("/auth-google", googleOAuthController);
router.post("/google-signup", googleSignupController);
router.post("/google-login", googleLoginController);
// get all users
router.get("/all", getAllUsersController);
router.get("/check/:username", checkUsernameController);

export default router;
