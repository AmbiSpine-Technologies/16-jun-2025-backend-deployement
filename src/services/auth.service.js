import User from "../models/user.model.js";
import { MSG } from "../constants/messages.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import Profile from "../models/profile.model.js";

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

export const loginService = async (email, password, rememberMe) => {
  const user = await User.findOne({
    $or: [{ email }, { email: email }],
  });

  if (!user) {
    return { success: false, message: MSG.AUTH.INVALID_CREDENTIALS };
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    return { success: false, message: MSG.AUTH.INVALID_CREDENTIALS };
  }

   const tokenExpiry = rememberMe ? "30d" : "1d";

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
