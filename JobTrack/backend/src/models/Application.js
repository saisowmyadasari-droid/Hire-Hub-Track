// This model links a Student to a specific Job and tracks application status.
// It centralizes business rules around "applied", "pending", "selected", "rejected", and "declined".
// The dynamic status logic for 6-day and 12-day windows is implemented as a virtual field.

import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    // Reference to the student who applied.
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    // Reference to the job the candidate applied for.
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },
    // `status` stores the last explicit decision from the Admin, if any.
    // If it remains "applied", the UI will compute Pending or Declined based on days elapsed.
    status: {
      type: String,
      enum: ["applied", "selected", "rejected"],
      default: "applied"
    },
    // This timestamp is used in the date-based status math required by the spec.
    appliedAt: {
      type: Date,
      default: Date.now
    },
    // Optional notes allow HR to capture quick feedback about each application.
    notes: {
      type: String
    },
    // We keep a snapshot of resume URL at application time to avoid surprises
    // if the student later updates their profile resume.
    resumeUrlSnapshot: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// This virtual computes the "display status" based on Admin decisions and time.
// - If Admin sets Selected/Rejected, we respect that.
// - If status is still "applied" and:
//   * daysElapsed >= 12 => "declined" (red)
//   * daysElapsed >= 6  => "pending" (orange)
//   * otherwise         => "applied" (initial state)
applicationSchema.virtual("computedStatus").get(function () {
  if (this.status === "selected" || this.status === "rejected") {
    return this.status;
  }

  const appliedDate = this.appliedAt || this.createdAt || new Date();
  const daysElapsed =
    (Date.now() - appliedDate.getTime()) / (1000 * 60 * 60 * 24);

  if (daysElapsed >= 12) {
    return "declined";
  }

  if (daysElapsed >= 6) {
    return "pending";
  }

  return "applied";
});

export const Application = mongoose.model("Application", applicationSchema);

