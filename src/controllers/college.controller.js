import {
  createCollegeService,
  getCollegeByIdService,
  updateCollegeService,
  getMyCollegesService,
  getAllCollegesService,
} from "../services/college.service.js";
import { MSG } from "../constants/messages.js";

export const createCollege = async (req, res) => {
  try {
       const logoUrl = req.files?.logo?.[0]?.path || "";
    const docUrl = req.files?.verificationDoc?.[0]?.path || "";


 const collegeData = {
      ...req.body,
      logo: logoUrl,
      verificationDoc: docUrl,
    };

    const result = await createCollegeService(collegeData, req.user._id);
    res.status(result.success ? 201 : 400).json(result);

  } catch (err) {
    console.error("CREATE COLLEGE ERROR:", err);
    res.status(500).json({
      success: false,
      message: MSG.ERROR.SERVER_ERROR,
    });
  }
};

export const getAllColleges = async (req, res) => {
  try {
    const result = await getAllCollegesService();

    return res.status(200).json(result);
  } catch (err) {
    console.error("GET ALL COLLEGES ERROR:", err);

    return res.status(500).json({
      success: false,
      message: MSG.ERROR.SERVER_ERROR,
    });
  }
};


export const getCollegeById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "College ID is required",
      });
    }
    const result = await getCollegeByIdService(id);
    res.status(result.success ? 200 : 404).json(result);
  } catch (err) {
    console.error("GET COLLEGE BY ID ERROR:", err);
    res.status(500).json({
      success: false,
      message: MSG.ERROR.SERVER_ERROR,
    });
  }
};

export const updateCollege = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "College ID is required",
      });
    }
    const result = await updateCollegeService(id, req.user._id, req.body);
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    console.error("UPDATE COLLEGE ERROR:", err);
    res.status(500).json({
      success: false,
      message: MSG.ERROR.SERVER_ERROR,
    });
  }
};

export const getMyColleges = async (req, res) => {
  try {
    const { page, limit, sortBy, order } = req.query;
    const pagination = {
      page: page || 1,
      limit: limit || 10,
      sortBy: sortBy || "createdAt",
      order: order || "desc",
    };
    const result = await getMyCollegesService(req.user._id, pagination);
    res.status(200).json(result);
  } catch (err) {
    console.error("GET MY COLLEGES ERROR:", err);
    res.status(500).json({
      success: false,
      message: MSG.ERROR.SERVER_ERROR,
    });
  }
};


