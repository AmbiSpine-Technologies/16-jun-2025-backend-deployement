import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Job from "../models/job.model.js";
import Community from "../models/community.model.js";
import Profile from "../models/profile.model.js";

// Global search
export const globalSearchService = async (query, filters = {}, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const results = {
      users: [],
      posts: [],
      jobs: [],
      communities: [],
    };

    // Search users
    if (!filters.type || filters.type === "users") {
      const users = await User.find({
        $or: [
          { firstName: { $regex: query, $options: "i" } },
          { lastName: { $regex: query, $options: "i" } },
          { userName: { $regex: query, $options: "i" } },
        ],
      })
        .select("firstName lastName userName email profileImage")
        .limit(limit)
        .lean();
      results.users = users;
    }

    // Search posts
    if (!filters.type || filters.type === "posts") {
      const posts = await Post.find({
        $text: { $search: query },
        isDeleted: false,
      })
        .populate("author", "firstName lastName userName email profileImage")
        .limit(limit)
        .lean();
      results.posts = posts;
    }

    // Search jobs
    if (!filters.type || filters.type === "jobs") {
      const jobs = await Job.find({
        $text: { $search: query },
        isActive: true,
      })
        .populate("postedBy", "firstName lastName userName")
        .limit(limit)
        .lean();
      results.jobs = jobs;
    }

    // Search communities
    if (!filters.type || filters.type === "communities") {
      const communities = await Community.find({
        $text: { $search: query },
        isActive: true,
      })
        .populate("creator", "firstName lastName userName email profileImage")
        .limit(limit)
        .lean();
      results.communities = communities;
    }

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    console.error("GLOBAL SEARCH ERROR:", error);
    return {
      success: false,
      message: "Failed to perform search",
      error: error.message,
    };
  }
};

// Search users
export const searchUsersService = async (query, page = 1, limit = 20) => {
  try {
    const skip = (page - 1) * limit;

    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { userName: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    })
      .select("firstName lastName userName email profileImage")
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { userName: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });

    return {
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("SEARCH USERS ERROR:", error);
    return {
      success: false,
      message: "Failed to search users",
      error: error.message,
    };
  }
};

// Search posts
export const searchPostsService = async (query, filters = {}, page = 1, limit = 20) => {
  try {
    const skip = (page - 1) * limit;
    const searchQuery = {
      $text: { $search: query },
      isDeleted: false,
    };

    if (filters.author) {
      searchQuery.author = filters.author;
    }

    if (filters.tags && filters.tags.length > 0) {
      searchQuery.tags = { $in: filters.tags };
    }

    const posts = await Post.find(searchQuery)
      .populate("author", "firstName lastName userName email profileImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Post.countDocuments(searchQuery);

    return {
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("SEARCH POSTS ERROR:", error);
    return {
      success: false,
      message: "Failed to search posts",
      error: error.message,
    };
  }
};

// Search jobs
export const searchJobsService = async (query, filters = {}, page = 1, limit = 20) => {
  try {
    const skip = (page - 1) * limit;
    const searchQuery = {
      $text: { $search: query },
      isActive: true,
    };

    if (filters.location) {
      searchQuery.location = { $regex: filters.location, $options: "i" };
    }

    if (filters.workMode) {
      searchQuery.workMode = filters.workMode;
    }

    if (filters.jobType) {
      searchQuery.jobType = filters.jobType;
    }

    const jobs = await Job.find(searchQuery)
      .populate("postedBy", "firstName lastName userName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Job.countDocuments(searchQuery);

    return {
      success: true,
      data: jobs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("SEARCH JOBS ERROR:", error);
    return {
      success: false,
      message: "Failed to search jobs",
      error: error.message,
    };
  }
};

// Search communities
export const searchCommunitiesService = async (query, filters = {}, page = 1, limit = 20) => {
  try {
    const skip = (page - 1) * limit;
    const searchQuery = {
      $text: { $search: query },
      isActive: true,
    };

    if (filters.privacy) {
      searchQuery.privacy = filters.privacy;
    }

    if (filters.category) {
      searchQuery.category = filters.category;
    }

    const communities = await Community.find(searchQuery)
      .populate("creator", "firstName lastName userName email profileImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Community.countDocuments(searchQuery);

    return {
      success: true,
      data: communities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("SEARCH COMMUNITIES ERROR:", error);
    return {
      success: false,
      message: "Failed to search communities",
      error: error.message,
    };
  }
};









