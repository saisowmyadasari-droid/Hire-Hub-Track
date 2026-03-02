// This model represents a job posting created by an Admin/HR user.
// Each job can have many applications from different students.
// Separating jobs from applications keeps queries efficient and flexible.

import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    // Core job metadata displayed in listings and detail views.
    title: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    // Job type powers filters like Full-time, Remote, Internship on the UI.
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract", "remote"],
      default: "full-time"
    },
    // These fields drive advanced search and display details for candidates.
    description: {
      type: String,
      required: true
    },
    requirements: {
      type: String
    },
    salaryRange: {
      type: String,
      trim: true
    },
    // Link to the Admin/HR who created this job to enable auditing and future features.
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export const Job = mongoose.model("Job", jobSchema);

