import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
  console.error("⚠️  WARNING: EMAIL_USER or EMAIL_APP_PASSWORD not set in .env file");
  console.error("Please set these variables to enable email functionality:");
  console.error("EMAIL_USER=your-email@gmail.com");
  console.error("EMAIL_APP_PASSWORD=your-app-password");
} else {
  console.log("✅ Email credentials loaded from .env");
  console.log(`📧 Email User: ${process.env.EMAIL_USER}`);
  console.log(`🔑 App Password: ${process.env.EMAIL_APP_PASSWORD ? '***' + process.env.EMAIL_APP_PASSWORD.slice(-4) : 'NOT SET'}`);
}

let transporter;
try {
  transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_APP_PASSWORD,
  },
    secure: true,
    tls: {
      rejectUnauthorized: false
    }
});
  console.log("✅ Nodemailer transporter created successfully");
} catch (error) {
  console.error("❌ Error creating transporter:", error);
}

const otpStore = {}; 

export const sendOTP = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000);  

  otpStore[email] = otp;
  
  const otpExpiry = Date.now() + 10 * 60 * 1000; 
  otpStore[`${email}_expiry`] = otpExpiry;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "SpreadNext Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0038FF;">SpreadNext Email Verification</h2>
        <p>Your verification code is:</p>
        <h1 style="color: #0038FF; font-size: 32px; letter-spacing: 5px; text-align: center; padding: 20px; background: #f5f5f5; border-radius: 8px;">${otp}</h1>
        <p style="color: #666;">This code will expire in 10 minutes. If you didn't request this code, please ignore this email.</p>
        <p style="color: #666; margin-top: 20px;">Best regards,<br>The SpreadNext Team</p>
      </div>
    `,
  };

  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      console.error("❌ Email credentials not configured");
      return { 
        success: false, 
        message: "Email service not configured. Please contact administrator." 
      };
    }

    if (!transporter) {
      console.error("❌ Email transporter not initialized");
      return { 
        success: false, 
        message: "Email service not properly initialized." 
      };
    }

    console.log(`📤 Attempting to send OTP to: ${email}`);
    console.log(`📧 From: ${process.env.EMAIL_USER}`);
    
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP sent successfully to ${email}`);
    return { success: true, message: "OTP sent successfully to your email", email };
  } catch (error) {
    console.error("❌ Email sending error:", error);
    console.error("Error code:", error.code);
    console.error("Error response:", error.response);
    
    if (error.code === 'EAUTH') {
      
      const isDevelopment = process.env.NODE_ENV !== 'production';
      if (isDevelopment) {
       
        
        return { 
          success: true, 
          message: `OTP generated (email failed - check console for OTP code): ${otp}`, 
          email,
          developmentMode: true,
          otp: otp
        };
      }
      
      return { 
        success: false, 
        message: "Email authentication failed. Please verify your Gmail App Password is correct. Check server logs for detailed instructions." 
      };
    }
    
    const isDevelopment = process.env.NODE_ENV !== 'production';
    if (isDevelopment) {
      
      
      return { 
        success: true, 
        message: `OTP generated (email failed - check console for OTP code): ${otp}`, 
        email,
        developmentMode: true,
        otp: otp
      };
    }
    
    return { 
      success: false, 
      message: error.message || "Failed to send verification email. Please try again later." 
    };
  }
};

export const verifyOTP = async (email, otp) => {
  const storedOtp = otpStore[email];
  const expiry = otpStore[`${email}_expiry`];
  
  if (!storedOtp) {
    return { success: false, message: "OTP not found or already used" };
  }
  
  if (expiry && Date.now() > expiry) {
    delete otpStore[email];
    delete otpStore[`${email}_expiry`];
    return { success: false, message: "OTP has expired. Please request a new one." };
  }
  
  if (storedOtp == otp) {
    delete otpStore[email];
    delete otpStore[`${email}_expiry`];
    return { success: true, message: "OTP verified successfully" };
  }
  
  return { success: false, message: "Invalid OTP" };
};
