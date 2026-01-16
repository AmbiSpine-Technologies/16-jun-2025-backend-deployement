import Joi from "joi";

export const createJobApplicationValidation = Joi.object({
  resume: Joi.string().optional(),
  resumeUrl: Joi.string().uri().optional().allow(""),
  coverLetter: Joi.string().max(5000).optional().allow(""),
  answers: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().required(),
        answer: Joi.string().required(),
      })
    )
    .optional(),
});

export const updateApplicationStatusValidation = Joi.object({
  status: Joi.string()
    .valid("pending", "reviewing", "shortlisted", "interview", "rejected", "accepted", "withdrawn")
    .required(),
  notes: Joi.string().max(1000).optional().allow(""),
});

