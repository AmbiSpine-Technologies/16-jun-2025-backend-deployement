import Joi from "joi";
const USERNAME_REGEX = /^(?![0-9._])(?!.*[_.]{2})[a-zA-Z0-9._]{3,20}(?<![_.])$/;
export const registerValidation = Joi.object({
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  mobileNo: Joi.string().optional().allow(""),
  userName: Joi.string()
    .pattern(USERNAME_REGEX)
    .required()
    .messages({
      "string.pattern.base": 
        "Username 3-20 characters ka hona chahiye, letter se start hona chahiye, aur usmein lagatar do dots ya underscores nahi hone chahiye."
    }),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.valid(Joi.ref("password")).required(),
  isEmailVerified: Joi.boolean().optional()
});

export const loginValidation = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  rememberMe: Joi.boolean().optional()
});
