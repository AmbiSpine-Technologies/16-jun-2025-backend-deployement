import User from "../models/user.model.js";
import { MSG } from "../constants/messages.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import Profile from "../models/profile.model.js";
import admin from "../config/firebase.js";

export const registerService = async (data) => {
  const { email, userName, password } = data;

  const existing = await User.findOne({ 
    $or: [{ email }, { userName }] 
  });

  if (existing) {
    return { success: false, message: MSG.AUTH.USER_EXISTS };
  }

  const hashed = await hashPassword(password);

  const user = await User.create({ 
    ...data, 
    password: hashed,
    emailVerified: true 
  });

  await Profile.create({
    userId: user._id,
    personalInfo: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email,
      userName: user.userName,
    },
  });
  const token = generateToken(user._id);
  return {
    success: true,
    message: MSG.AUTH.REGISTER_SUCCESS,
    token,
    data: user
  };
};

// export const loginService = async (identifier, password, rememberMe) => {
//    const user = await User.findOne({
//     $or: [
//       { email: identifier },
//       { userName: identifier },
//     ],
//   });

//   if (!user) {
//     return { success: false, message: MSG.AUTH.INVALID_CREDENTIALS };
//   }

//   const isMatch = await comparePassword(password, user.password);

//   if (!isMatch) {
//     return { success: false, message: MSG.AUTH.INVALID_CREDENTIALS };
//   }

//   const userData = await User.aggregate([
//     { $match: { _id: user._id } },
//     {
//       $lookup: {
//         from: "profiles", // Aapke collection ka sahi naam check karlein
//         localField: "_id",
//         foreignField: "userId",
//         as: "profile"
//       }
//     },
//     { $unwind: { path: "$profile", preserveNullAndEmptyArrays: true } },
//     {
//       // Yahan hum decide karte hain kya bhejenge (Password excluded)
//       $project: {
//         password: 0, 
//         __v: 0,
//         "profile.__v": 0
//       }
//     }
//   ]);

//    const tokenExpiry = rememberMe ? "30d" : "7d";

//   const token = generateToken(user._id, tokenExpiry);

//   return {
//     success: true,
//     message: MSG.AUTH.LOGIN_SUCCESS,
//     token,
//     user: {
//       _id: user._id,
//       userName: user.userName,
//       email: user.email,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       emailVerified: user.emailVerified,
//     },
//     data: userData[0], 
//   };
// };



export const loginService = async (identifier, password, rememberMe) => {

   const user = await User.findOne({

    $or: [
      { email: identifier },
      { userName: identifier },
    ],

  });



  if (!user) {

    return { success: false, message: MSG.AUTH.INVALID_CREDENTIALS };

  }



  const isMatch = await comparePassword(password, user.password);



  if (!isMatch) {

    return { success: false, message: MSG.AUTH.INVALID_CREDENTIALS };

  }



   const tokenExpiry = rememberMe ? "30d" : "7d";



  const token = generateToken(user._id, tokenExpiry);



  return {

    success: true,

    message: MSG.AUTH.LOGIN_SUCCESS,

    token,

    user: {

      _id: user._id,

      userName: user.userName,

      email: user.email,

      firstName: user.firstName,

      lastName: user.lastName,

      emailVerified: user.emailVerified,

    },

    data: user, 

  };

};

export const generateUniqueUsername = async (email) => {
  let baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
  let username = baseUsername;
  let count = 1;

  while (await User.findOne({ userName: username })) {
    username = `${baseUsername}${count++}`;
  }

  return username;
};

export const googleOAuthService = async (idToken) => {
  try {
    // 1️⃣ Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture, uid } = decoded;

    // 2️⃣ Check user exists
    let user = await User.findOne({ email });

    // 🔹 USER EXISTS
    if (user) {
      // If user has NOT completed onboarding
      if (!user.onboardingCompleted) {
        return {
          success: true,
          type: "LOGIN", // treat like signup
          token: generateToken(user._id),
          onboardingRequired: true,
          user,
        };
      }

      // Normal login
      if (!user.firebaseUid) {
        user.firebaseUid = uid;
        user.authProvider = "google";
        user.emailVerified = true;
        await user.save();
      }

      return {
        success: true,
        type: "LOGIN",
        token: generateToken(user._id),
        onboardingRequired: false,
        user,
      };
    }

    // 🔹 NEW USER → SIGNUP
    const username = await generateUniqueUsername(email);

    user = await User.create({
      email,
      userName: username,
      firebaseUid: uid,
      authProvider: "google",
      firstName: name?.split(" ")[0] || "",
      lastName: name?.split(" ").slice(1).join(" ") || "",
      emailVerified: true,
      onboardingCompleted: false,
    });

    // ✅ PROFILE CREATE
    await Profile.create({
      userId: user._id,
      personalInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        email,
        userName: username,
        // profileImage: picture || "",
      },
    });

    return {
      success: true,
      type: "SIGNUP",
      token: generateToken(user._id),
      onboardingRequired: true,
      user,
    };

  } catch (err) {
    console.error("Google OAuth Service Error:", err.message);
    throw err;
  }
};
