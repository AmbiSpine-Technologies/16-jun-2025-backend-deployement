import {
  createCompanyService,
  getCompanyByIdService,
  updateCompanyService,
  deleteCompanyService,
  getMyCompaniesService,
  getAllCompaniesService,
} from "../services/company.service.js";
import { MSG } from "../constants/messages.js";

// Create a new company
export const createCompany = async (req, res) => {
  try {
    const logoUrl = req.files?.logo?.[0]?.path || "";
    const docUrl = req.files?.verificationDoc?.[0]?.path || "";

    const companyData = {
      ...req.body,
      logo: logoUrl,
      verificationDoc: docUrl,
    };
    const result = await createCompanyService(companyData, req.user._id);
    
    res.status(result.success ? 201 : 400).json(result);
  } catch (err) {
    console.error("CREATE COMPANY ERROR:", err);
    res.status(500).json({
      success: false,
      message: MSG.ERROR.SERVER_ERROR,
    });
  }
};

// Get company by ID
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }

    const result = await getCompanyByIdService(id);
    res.status(result.success ? 200 : 404).json(result);
  } catch (err) {
    console.error("GET COMPANY BY ID ERROR:", err);
    res.status(500).json({
      success: false,
      message: MSG.ERROR.SERVER_ERROR,
    });
  }
};

// Update company
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }

    const result = await updateCompanyService(id, req.user._id, req.body);
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    console.error("UPDATE COMPANY ERROR:", err);
    res.status(500).json({
      success: false,
      message: MSG.ERROR.SERVER_ERROR,
    });
  }
};

// Delete company
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }

    const result = await deleteCompanyService(id, req.user._id);
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    console.error("DELETE COMPANY ERROR:", err);
    res.status(500).json({
      success: false,
      message: MSG.ERROR.SERVER_ERROR,
    });
  }
};

// Get companies created/managed by logged-in user
export const getMyCompanies = async (req, res) => {
  try {
    const { page, limit, sortBy, order } = req.query;

    const pagination = {
      page: page || 1,
      limit: limit || 10,
      sortBy: sortBy || "createdAt",
      order: order || "desc",
    };

    const result = await getMyCompaniesService(req.user._id, pagination);
    res.status(200).json(result);
  } catch (err) {
    console.error("GET MY COMPANIES ERROR:", err);
    res.status(500).json({
      success: false,
      message: MSG.ERROR.SERVER_ERROR,
    });
  }
};

// Get all companies (public)
export const getAllCompanies = async (req, res) => {
  try {
    const { search, industry, location, isVerified, page, limit, sortBy, order } = req.query;

    const filters = {
      search,
      industry,
      location,
      isVerified,
    };

    const pagination = {
      page: page || 1,
      limit: limit || 12,
      sortBy: sortBy || "createdAt",
      order: order || "desc",
    };

    const result = await getAllCompaniesService(filters, pagination);
    res.status(200).json(result);
  } catch (err) {
    console.error("GET ALL COMPANIES ERROR:", err);
    res.status(500).json({
      success: false,
      message: MSG.ERROR.SERVER_ERROR,
    });
  }
};


