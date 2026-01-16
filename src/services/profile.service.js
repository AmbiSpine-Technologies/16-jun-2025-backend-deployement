import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import Connection from "../models/connection.model.js";
import { MSG } from "../constants/messages.js";

export const createOrUpdateProfile = async (userId, profileData) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Debug: Log received data
    console.log("📥 Received profile data:", JSON.stringify(profileData, null, 2));

    const personalInfo = profileData.personalInfo || {};
    
    // Ensure required fields are present
    const firstName = personalInfo.firstName?.trim() || user.firstName?.trim();
    const lastName = personalInfo.lastName?.trim() || user.lastName?.trim();
    const email = personalInfo.email?.trim() || user.email?.trim();
    
    // Validate required fields
    if (!firstName || firstName.length < 2) {
      console.error("❌ Missing or invalid firstName:", { firstName, userFirstName: user.firstName });
      return {
        success: false,
        message: "First name is required and must be at least 2 characters",
      };
    }
    
    if (!lastName || lastName.length < 2) {
      console.error("❌ Missing or invalid lastName:", { lastName, userLastName: user.lastName });
      return {
        success: false,
        message: "Last name is required and must be at least 2 characters",
      };
    }
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.error("❌ Missing or invalid email:", { email, userEmail: user.email });
      return {
        success: false,
        message: "Valid email is required",
      };
    }

    const updatedProfileData = {
      ...profileData,
      personalInfo: {
        ...personalInfo,
        firstName: firstName,
        lastName: lastName,
        email: email.toLowerCase(),
      },
    };

    // Debug: Log processed data
    console.log("📝 Processed profile data:", JSON.stringify(updatedProfileData, null, 2));

    let profile = await Profile.findOne({ userId });

    if (profile) {
      console.log("📝 Updating existing profile for userId:", userId);
      // Update existing profile - use save() method for better nested object handling
      Object.keys(updatedProfileData).forEach(key => {
        if (key !== 'userId' && key !== '_id') {
          profile[key] = updatedProfileData[key];
        }
      });
      profile.lastUpdated = new Date();
      
      try {
        await profile.save();
        console.log("✅ Profile updated successfully");
      } catch (saveError) {
        console.error("❌ Error saving profile:", saveError);
        console.error("❌ Save error details:", {
          message: saveError.message,
          name: saveError.name,
          errors: saveError.errors,
        });
        throw saveError;
      }
      
      // Debug: Log saved profile
      console.log("✅ Profile saved successfully:", JSON.stringify(profile.toObject(), null, 2));
      
      return {
        success: true,
        message: "Profile updated successfully",
        data: profile,
      };
    } else {
      console.log("📝 Creating new profile for userId:", userId);
      try {
        profile = await Profile.create({
          userId,
          ...updatedProfileData,
          lastUpdated: new Date(),
        });
        console.log("✅ Profile created successfully");
        return {
          success: true,
          message: "Profile created successfully",
          data: profile,
        };
      } catch (createError) {
        console.error("❌ Error creating profile:", createError);
        console.error("❌ Create error details:", {
          message: createError.message,
          name: createError.name,
          errors: createError.errors,
        });
        throw createError;
      }
    }
  } catch (error) {
    console.error("❌ Profile service error:", error);
    console.error("❌ Error stack:", error.stack);
    return {
      success: false,
      message: error.message || "Failed to save profile",
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    };
  }
};

export const getProfileByUserId = async (userId) => {
  try {
    const profile = await Profile.findOne({ userId }).populate("userId", "userName email firstName lastName profileImage");
    
    if (!profile) {
      return {
        success: false,
        message: "Profile not found",
      };
    }

    // Get following and followers arrays from Connection model
    const [following, followers] = await Promise.all([
      Connection.find({ follower: userId, status: "accepted" })
        .populate("following", "_id userName firstName lastName profileImage")
        .lean(),
      Connection.find({ following: userId, status: "accepted" })
        .populate("follower", "_id userName firstName lastName profileImage")
        .lean(),
    ]);

    // Convert profile to object and add following/followers arrays
    const profileObj = profile.toObject();
    profileObj.userId = profileObj.userId || {};
    profileObj.userId.following = following.map(c => c.following?._id || c.following);
    profileObj.userId.followers = followers.map(c => c.follower?._id || c.follower);

    return {
      success: true,
      message: "Profile retrieved successfully",
      data: profileObj,
    };
  } catch (error) {
    console.error("Get profile error:", error);
    return {
      success: false,
      message: error.message || "Failed to retrieve profile",
    };
  }
};

export const getProfileByUsername = async (username) => {
  try {
    const user = await User.findOne({ userName: username });
    
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const profile = await Profile.findOne({ userId: user._id }).populate("userId", "userName email firstName lastName profileImage");
    
    if (!profile) {
      return {
        success: false,
        message: "Profile not found",
      };
    }

    // Get following and followers arrays from Connection model
    const [following, followers] = await Promise.all([
      Connection.find({ follower: user._id, status: "accepted" })
        .populate("following", "_id userName firstName lastName profileImage")
        .lean(),
      Connection.find({ following: user._id, status: "accepted" })
        .populate("follower", "_id userName firstName lastName profileImage")
        .lean(),
    ]);

    // Convert profile to object and add following/followers arrays
    const profileObj = profile.toObject();
    profileObj.userId = profileObj.userId || {};
    profileObj.userId.following = following.map(c => c.following?._id || c.following);
    profileObj.userId.followers = followers.map(c => c.follower?._id || c.follower);

    return {
      success: true,
      message: "Profile retrieved successfully",
      data: profileObj,
    };
  } catch (error) {
    console.error("Get profile by username error:", error);
    return {
      success: false,
      message: error.message || "Failed to retrieve profile",
    };
  }
};

// export const updateProfileSection = async (userId, section, data) => {
//   try {
//     const profile = await Profile.findOne({ userId });

//     if (!profile) {
//       return {
//         success: false,
//         message: "Profile not found. Please create profile first.",
//       };
//     }

//     profile[section] = data;
//     profile.lastUpdated = new Date();
//     await profile.save();

//     return {
//       success: true,
//       message: `${section} updated successfully`,
//       data: profile,
//     };
//   } catch (error) {
//     console.error("Update profile section error:", error);
//     return {
//       success: false,
//       message: error.message || "Failed to update profile section",
//     };
//   }
// };


export const updateProfileSection = async (userId, section, data) => {
  try {
    const profile = await Profile.findOneAndUpdate({ userId },
       {
        $set: {
          [section]: data,
          lastUpdated: new Date(),
        },
      },
      {
        new: true,
        upsert: true, // 🔥 THIS IS THE FIX
      }
    );

    if (!profile) {
      return {
        success: false,
        message: "Profile not found. Please create profile first.",
      };
    }

    profile[section] = data;
    profile.lastUpdated = new Date();
    await profile.save();

    return {
      success: true,
      message: `${section} updated successfully`,
      data: profile,
    };
  } catch (error) {
    console.error("Update profile section error:", error);
    return {
      success: false,
      message: error.message || "Failed to update profile section",
    };
  }
};

export const addItemToSection = async (userId, section, item) => {
  try {
    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return {
        success: false,
        message: "Profile not found. Please create profile first.",
      };
    }

    const arraySections = [
      "socialLinks",
      "workExperience",
      "education",
      "projects",
      "skills",
      "interests",
      "languages",
      "certificates",
      "publications",
      "awardsAchievements",
    ];

    if (!arraySections.includes(section)) {
      return {
        success: false,
        message: `Invalid section: ${section}. Cannot add item to this section.`,
      };
    }

    profile[section].push(item);
    profile.lastUpdated = new Date();
    await profile.save();

    return {
      success: true,
      message: `Item added to ${section} successfully`,
      data: profile,
    };
  } catch (error) {
    console.error("Add item to section error:", error);
    return {
      success: false,
      message: error.message || "Failed to add item",
    };
  }
};

export const updateItemInSection = async (userId, section, itemId, updatedItem) => {
  try {
    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return {
        success: false,
        message: "Profile not found. Please create profile first.",
      };
    }

    const arraySections = [
      "socialLinks",
      "workExperience",
      "education",
      "projects",
      "certificates",
      "publications",
      "awardsAchievements",
    ];

    if (!arraySections.includes(section)) {
      return {
        success: false,
        message: `Invalid section: ${section}. Cannot update item in this section.`,
      };
    }

    const itemIndex = profile[section].findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      return {
        success: false,
        message: "Item not found",
      };
    }

    profile[section][itemIndex] = { ...profile[section][itemIndex].toObject(), ...updatedItem };
    profile.lastUpdated = new Date();
    await profile.save();

    return {
      success: true,
      message: `Item updated in ${section} successfully`,
      data: profile,
    };
  } catch (error) {
    console.error("Update item in section error:", error);
    return {
      success: false,
      message: error.message || "Failed to update item",
    };
  }
};

export const deleteItemFromSection = async (userId, section, itemId) => {
  try {
    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return {
        success: false,
        message: "Profile not found. Please create profile first.",
      };
    }

    const arraySections = [
      "socialLinks",
      "workExperience",
      "education",
      "projects",
      "certificates",
      "publications",
      "awardsAchievements",
    ];

    if (!arraySections.includes(section)) {
      return {
        success: false,
        message: `Invalid section: ${section}. Cannot delete item from this section.`,
      };
    }

    profile[section] = profile[section].filter(
      (item) => item._id.toString() !== itemId
    );
    profile.lastUpdated = new Date();
    await profile.save();

    return {
      success: true,
      message: `Item deleted from ${section} successfully`,
      data: profile,
    };
  } catch (error) {
    console.error("Delete item from section error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete item",
    };
  }
};

export const updateArrayField = async (userId, field, items) => {
  try {
    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return {
        success: false,
        message: "Profile not found. Please create profile first.",
      };
    }

    const arrayFields = ["skills", "interests", "languages"];

    if (!arrayFields.includes(field)) {
      return {
        success: false,
        message: `Invalid field: ${field}. Cannot update this field.`,
      };
    }

    profile[field] = items;
    profile.lastUpdated = new Date();
    await profile.save();

    return {
      success: true,
      message: `${field} updated successfully`,
      data: profile,
    };
  } catch (error) {
    console.error("Update array field error:", error);
    return {
      success: false,
      message: error.message || "Failed to update field",
    };
  }
};

export const deleteProfile = async (userId) => {
  try {
    const profile = await Profile.findOneAndDelete({ userId });

    if (!profile) {
      return {
        success: false,
        message: "Profile not found",
      };
    }

    return {
      success: true,
      message: "Profile deleted successfully",
    };
  } catch (error) {
    console.error("Delete profile error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete profile",
    };
  }
};












