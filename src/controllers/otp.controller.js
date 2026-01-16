import { sendOTP, verifyOTP } from "../services/otp.service.js";

export const sendOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const result = await sendOTP(email);
    
    if (result.success) {
    res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }

  } catch (err) {
    console.error("OTP ERROR:", err); 
    res.status(500).json({ 
      success: false,
      message: "Failed to send OTP", 
      error: err.message 
    });
  }
};

export const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const result = await verifyOTP(email, otp);
    res.status(result.success ? 200 : 400).json(result);

  } catch (err) {
    res.status(500).json({ message: "OTP verification failed" });
  }
};
