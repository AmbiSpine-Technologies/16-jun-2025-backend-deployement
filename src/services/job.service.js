import Job from "../models/job.model.js";
import { MSG } from "../constants/messages.js";

export const createJobService = async (jobData, userId) => {
  try {
    const job = await Job.create({
      ...jobData,
      postedBy: userId,
    });

    const populatedJob = await Job.findById(job._id).populate(
      "postedBy",
      "userName email firstName lastName"
    );

    return {
      success: true,
      message: MSG.JOB.CREATE_SUCCESS,
      data: populatedJob,
    };
  } catch (error) {
    throw error;
  }
};

export const getAllJobsService = async (filters = {}, pagination = {}) => {
  try {
    const {
      search,
      location,
      workMode,
      jobType,
      industry,
      companySize,
      minExperience,
      maxExperience,
      skills,
      isActive = true,
    } = filters;

    const {
      page = 1,
      limit = 12,
      sortBy = "createdAt",
      order = "desc",
    } = pagination;

    const query = { isActive };

    // Search in title, company, skills
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { skills: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (workMode) {
      query.workMode = workMode;
    }

    if (jobType) {
      if (Array.isArray(jobType)) {
        query.jobType = { $in: jobType };
      } else {
        query.jobType = jobType;
      }
    }

    if (industry) {
      if (Array.isArray(industry)) {
        query.industry = { $in: industry };
      } else {
        query.industry = industry;
      }
    }

    if (companySize) {
      query.companySize = companySize;
    }

    if (skills && Array.isArray(skills) && skills.length > 0) {
      query.skills = { $in: skills };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOrder = order === "desc" ? -1 : 1;

    const jobs = await Job.find(query)
      .populate("postedBy", "userName email firstName lastName")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    return {
      success: true,
      message: MSG.JOB.FETCH_SUCCESS,
      data: jobs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getJobByIdService = async (jobId) => {
  try {
    const job = await Job.findById(jobId).populate(
      "postedBy",
      "userName email firstName lastName"
    );

    if (!job) {
      return {
        success: false,
        message: MSG.JOB.NOT_FOUND,
      };
    }

    // Increment views
    job.views += 1;
    await job.save();

    return {
      success: true,
      message: MSG.JOB.FETCH_SINGLE_SUCCESS,
      data: job,
    };
  } catch (error) {
    throw error;
  }
};

export const updateJobService = async (jobId, userId, updateData) => {
  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return {
        success: false,
        message: MSG.JOB.NOT_FOUND,
      };
    }

    // Check if user is the owner
    if (job.postedBy.toString() !== userId.toString()) {
      return {
        success: false,
        message: MSG.JOB.UNAUTHORIZED,
      };
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("postedBy", "userName email firstName lastName");

    return {
      success: true,
      message: MSG.JOB.UPDATE_SUCCESS,
      data: updatedJob,
    };
  } catch (error) {
    throw error;
  }
};

export const deleteJobService = async (jobId, userId) => {
  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return {
        success: false,
        message: MSG.JOB.NOT_FOUND,
      };
    }

    // Check if user is the owner
    if (job.postedBy.toString() !== userId.toString()) {
      return {
        success: false,
        message: MSG.JOB.UNAUTHORIZED,
      };
    }

    await Job.findByIdAndDelete(jobId);

    return {
      success: true,
      message: MSG.JOB.DELETE_SUCCESS,
    };
  } catch (error) {
    throw error;
  }
};

export const getMyJobsService = async (userId, pagination = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = pagination;

    const skip = (page - 1) * limit;
    const sortOrder = order === "desc" ? -1 : 1;

    const jobs = await Job.find({ postedBy: userId })
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments({ postedBy: userId });

    return {
      success: true,
      message: MSG.JOB.FETCH_SUCCESS,
      data: jobs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getFeaturedJobsService = async (limit = 10) => {
  try {
    const jobs = await Job.find({ isActive: true, isFeatured: true })
      .populate("postedBy", "userName email firstName lastName")
      .sort({ createdAt: -1 })
      .limit(limit);

    return {
      success: true,
      message: MSG.JOB.FETCH_SUCCESS,
      data: jobs,
    };
  } catch (error) {
    throw error;
  }
};
