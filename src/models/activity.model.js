import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "post_created",
        "post_liked",
        "post_commented",
        "post_reposted",
        "comment_liked",
        "user_followed",
        "job_applied",
        "community_joined",
        "collaboration_joined",
        "resume_created",
        "profile_updated",
      ],
      required: true,
      index: true,
    },
    targetType: {
      type: String,
      enum: ["Post", "Comment", "User", "Job", "Community", "Collaboration", "Resume", null],
      default: null,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ user: 1, type: 1, createdAt: -1 });

export default mongoose.model("Activity", activitySchema);









