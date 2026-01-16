import { registerValidation, loginValidation } from "../validations/user.validation.js";
import { registerService, loginService } from "../services/auth.service.js";
import { MSG } from "../constants/messages.js";
import User from "../models/user.model.js";
export const registerUser = async (req, res) => {
  try {
    const { email, isEmailVerified } = req.body;

    if (!isEmailVerified)
      return res.status(400).json({ message: "Please verify your email first" });

    const { error } = registerValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const result = await registerService(req.body);
    res.status(result.success ? 201 : 400).json(result);

  } catch (err) {
    res.status(500).json({ message: MSG.ERROR.SERVER_ERROR });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { error } = loginValidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { email, password, rememberMe } = req.body;

    const result = await loginService(email, password, rememberMe);
    res.status(result.success ? 200 : 400).json(result);

  } catch (err) {
    res.status(500).json({ message: MSG.ERROR.SERVER_ERROR });
  }
};



export const getAllUsersController = async (req, res) => {
  try {
    const users = await User.find(
      {},
      "firstName lastName userName email profileImage"
    );

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

export const checkUsernameController = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({
      userName: new RegExp(`^${username}$`, "i"), // case-insensitive
    });

    if (user) {
      return res.status(200).json({
        success: false,
        available: false,
        message: "Username already taken",
      });
    }

    res.status(200).json({
      success: true,
      available: true,
      message: "Username available",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking username",
    });
  }
};
