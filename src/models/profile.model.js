import mongoose from "mongoose";

const socialLinkSchema = new mongoose.Schema({
  platform: { type: String, required: true }, 
  customName: { type: String, default: "" },
  url: { type: String, required: true },
}, { _id: true });

const workExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  jobTitle: { type: String, required: true },
  employmentType: { type: String, enum: ["Full-time", "Part-time", "Contract", "Internship", "Freelance"], default: "Full-time" },
  location: { type: String, default: "" },
  startDate: { type: String, required: true }, 
  endDate: { type: String, default: "" }, 
  description: { type: String, default: "" },
  bullets: [{ type: String }], 
  hidden: { type: Boolean, default: false },
}, { _id: true });

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true }, 
  institution: { type: String, required: true },
  field: { type: String, default: "" }, 
  specialization: { type: String, default: "" },
  board: { type: String, default: "" }, 
  startDate: { type: String, default: "" },
  endDate: { type: String, default: "" },
  grade: { type: String, default: "" }, 
  description: { type: String, default: "" },
  hidden: { type: Boolean, default: false },
}, { _id: true });

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  url: { type: String, default: "" },
  startDate: { type: String, default: "" },
  endDate: { type: String, default: "" },
  bullets: [{ type: String }],
  hidden: { type: Boolean, default: false },
}, { _id: true });

const certificateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String, default: "" },
  issueDate: { type: String, default: "" },
  expiryDate: { type: String, default: "" },
  credentialId: { type: String, default: "" },
  credentialUrl: { type: String, default: "" },
  description: { type: String, default: "" },
  hidden: { type: Boolean, default: false },
}, { _id: true });

const publicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  publisher: { type: String, default: "" },
  publicationDate: { type: String, default: "" },
  url: { type: String, default: "" },
  description: { type: String, default: "" },
  hidden: { type: Boolean, default: false },
}, { _id: true });

const awardAchievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, default: "" },
  date: { type: String, default: "" },
  description: { type: String, default: "" },
  hidden: { type: Boolean, default: false },
}, { _id: true });

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    
    personalInfo: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
      headline: { type: String, default: "" }, 
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, default: "" },
      country: { type: String, default: "" },
      state: { type: String, default: "" },
      city: { type: String, default: "" },
      address: { type: String, default: "" },
      location: { type: String, default: "" }, 
      preferredLanguage: { type: String, default: "" },
      dateOfBirth: { type: String, default: "" }, 
      gender: { type: String, enum: ["Male", "Female", "Others", ""], default: "" },
      journeyType: { type: String, enum: ["Student", "Professional / Jobseeker", ""], default: "" }, // What defines your journey
    },

    socialLinks: [socialLinkSchema],

    profileSummary: { type: String, default: "" },

    workExperience: [workExperienceSchema],

    education: [educationSchema],

    projects: [projectSchema],

    skills: [{ type: String }],

    interests: [{ type: String }],

    languages: [{ type: String }],

    certificates: [certificateSchema],

    publications: [publicationSchema],

    awardsAchievements: [awardAchievementSchema],

    learningJourney: {
      educationLevel: { type: String, default: "" }, 
      fieldOfStudy: { type: String, default: "" }, 
      specialization: { type: String, default: "" },
      customEducationLevel: { type: String, default: "" },
      degree: { type: String, default: "" },
      learningMode: { type: String, enum: ["Online", "Regular", "Hybrid", ""], default: "" },
      lookingForJobOpportunities: { type: Boolean, default: false },
    },

    careerExpectations: {
      LookingPosition: { type: String, default: "" },
      industry: { type: String, default: "" },
      preferredJobRoles: [{ type: String }], 
      availability: { type: String, enum: ["Remote", "Onsite", "Hybrid", ""], default: "" },
      lookingForJobOpportunities: { type: Boolean, default: false },
    },

    jobAlertPreferences: {
      preferredRoleTypes: [{ type: String }], 
      locationPreference: { type: String, enum: ["Remote", "Online", "Hybrid", ""], default: "" },
      targetRole: { type: String, default: "" },
      targetIndustry: { type: String, default: "" },
      salaryRange: {
        min: { type: Number, default: null },
        max: { type: Number, default: null },
        currency: { type: String, default: "USD" },
      },
      recruitvisibility: { type: Boolean, default: false },
    },

    recentExperience: {
      jobTitle: { type: String, default: "" },
      currentRole: { type: String, default: "" },
      experienceYears: { type: String, default: "" }, 
      skills: {
    type: [String],
    default: [], 
  },

  portfolio: {
    type: String,
    default: "",
  },
    },

    interestsAndPreferences: {
      whyJoining: { type: String, default: "" },
      contentStylePreference: { type: String, default: "" },
      communityInterestClusters: [{ type: String }],
      contributionLevel: { type: String, default: "" },
      skillsOrThemesToShare: [{ type: String }],
      professionalIntent: { type: String, default: "" },
    },

    profileImage: { type: String, default: "" },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// userId already has unique: true which creates an index automatically

export default mongoose.model("Profile", profileSchema);


