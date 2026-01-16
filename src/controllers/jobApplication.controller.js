import {
  createJobApplicationValidation,
  updateApplicationStatusValidation,
} from "../validations/jobApplication.validation.js";
import {
  createJobApplicationService,
  getMyApplicationsService,
  getJobApplicationsService,
  getApplicationByIdService,
  updateApplicationStatusService,
  withdrawApplicationService,
} from "../services/jobApplication.service.js";
import { MSG } from "../constants/messages.js";

// Create a job application
export const createJobApplication = async (req, res) => {
  try {
    const { id } = req.params; // job id
    const { error } = createJobApplicationValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const result = await createJobApplicationService(id, req.user._id, req.body);
    res.status(result.success ? 201 : 400).json(result);
  } catch (err) {
    console.error("CREATE JOB APPLICATION ERROR:", err);
    res.status(500).json({
      success: false,
      message: MSG.ERROR.SERVER_ERROR || "Internal server error",
    });
  }
};

// Get my applications
export const getMyApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filters = {};
    if (status) filters.status = status;

    const result = await getMyApplicationsService(req.user._id, filters, parseInt(page), parseInt(limit));
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    console.error("GET MY APPLICATIONS ERROR:", err);
    res.status(500).json({
      success: false,
      message: MSG.ERROR.SERVER_ERROR || "Internal server error",
    });
  }
};

// Get applications for a job (employer view)
export const getJobApplications = async (req, res) => {
  try {
    const { id } = req.params; // job id
    const { status, page = 1, limit = 20 } = req.query;
    const filters = {};
    if (status) filters.status = status;

    const result = await getJobApplicationsService(id, req.user._id, filters, parseInt(page), parseInt(limit));
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    console.error("GET JOB APPLICATIONS ERROR:", err);
    res.status(500).json({
      success: false,
      message: MSG.ERROR.SERVER_ERROR || "Internal server error",
    });
  }
};

// Get application by ID
export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params; // application id
    const result = await getApplicationByIdService(id, req.user._id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("GET APPLICATION BY ID ERROR:", err);
    res.status(500).json({
      success: false,
      message: MSG.ERROR.SERVER_ERROR || "Internal server error",
    });
  }
};

// Update application status (employer only)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params; // application id
    const { error } = updateApplicationStatusValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const result = await updateApplicationStatusService(
      id,
      req.body.status,
      req.user._id,
      req.body.notes || ""
    );
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    console.error("UPDATE APPLICATION STATUS ERROR:", err);
    res.status(500).json({
      success: false,
      message: MSG.ERROR.SERVER_ERROR || "Internal server error",
    });
  }
};

// Withdraw application (applicant only)
export const withdrawApplication = async (req, res) => {
  try {
    const { id } = req.params; // application id
    const result = await withdrawApplicationService(id, req.user._id);
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    console.error("WITHDRAW APPLICATION ERROR:", err);
    res.status(500).json({
      success: false,
      message: MSG.ERROR.SERVER_ERROR || "Internal server error",
    });
  }
};

