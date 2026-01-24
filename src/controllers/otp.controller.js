import { sendOTP, verifyOTP, HRorTPOsendOTP, HRprTPOverifyOTP  } from "../services/otp.service.js";
import { createOrUpdateProfile } from "../services/profile.service.js";
import User from "../models/user.model.js";

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
    const result = await verifyOTP(email, otp);
    
    if (result.success) {
      // Logic: Generate a temporary token or session here if needed
      res.status(200).json({ success: true, message: "Verification successful" });
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};



export const HRorTPOOtpController = async (req, res) => {
  try {
    const { email, type } = req.body;
    
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    // FIX 1: Always convert to lowercase for consistency
    const emailLower = email.toLowerCase().trim();
    if (type === 'hr' && !emailLower.startsWith('hr')) {
      return res.status(400).json({ success: false, message: "HR email must start with 'hr'" });
    }
    if (type === 'tpo' && !emailLower.startsWith('tpo')) {
      return res.status(400).json({ success: false, message: "College TPO email must start with 'tpo'" });
    }

    // Pass the lowercase email to the sender function
    const result = await HRorTPOsendOTP(emailLower, type); 
    res.status(result.success ? 200 : 500).json(result);

  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};


export const HRorTPOverifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const emailLower = email.toLowerCase().trim();

    // 1. Verify OTP
    const result = await HRprTPOverifyOTP(emailLower, otp.toString());
    
    if (result.success) {
        // 2. Identify User
        let userId = req.user?._id;
        
        // Agar authMiddleware ne req.user nahi diya, toh email se User find karein
        if (!userId) {
            const user = await User.findOne({ email: emailLower });
            if (user) userId = user._id;
        }

        if (userId) {
            // 3. Logic: Decide Journey Type here in Controller
            let journeyType = "Recruiter"; // Default
            if (emailLower.startsWith("hr")) {
                journeyType = "Recruiter";
            } else if (emailLower.startsWith("tpo")) {
                journeyType = "TPO";
            }

            console.log("🎯 Journey Type Decided in Controller:", journeyType);

            // 4. Call Service with specific data
            const profileResult = await createOrUpdateProfile(userId, {
                personalInfo: {
                    email: emailLower,
                    journeyType: journeyType, // Controller ne pass kiya
                },
            });
            
            console.log("✅ Profile Sync Result:", profileResult.success);
        } else {
            console.log("⚠️ OTP Verified but no User found to update profile.");
        }
        
        return res.status(200).json({ success: true, message: "OTP Verified Successfully" });
    }

    return res.status(400).json(result);

  } catch (err) {
    console.error("Verification Error:", err);
    res.status(500).json({ message: "OTP verification failed (Server Error)" });
  }
};

// export const HRorTPOOtpController = async (req, res) => {

//   try {
//     const { email, type } = req.body; // type can be 'hr' or 'tpo'
//     if (!email) return res.status(400).json({ success: false, message: "Email is required" });

//     const emailLower = email.toLowerCase();
    
//     // Logic: Validation for HR or TPO prefix
//     // if (type === 'hr' && !emailLower.startsWith('hr@')) {
//     //   return res.status(400).json({ success: false, message: "HR email must start with 'hr@'" });
//     // }
//     if (type === 'tpo' && !emailLower.startsWith('tpo@')) {
//       return res.status(400).json({ success: false, message: "College TPO email must start with 'tpo@'" });
//     }

//     const result = await HRorTPOsendOTP(email, type);
//     res.status(result.success ? 200 : 500).json(result);

//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server Error", error: err.message });
//   }
// };