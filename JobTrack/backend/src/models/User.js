// This model represents users of the portal (both Students and Admin/HR).
// It holds authentication data plus profile fields used across the app.
// Having a single User model with a `role` field makes role-based access simple.

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // Basic identity fields displayed in the UI and emails.
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    // Password is stored as a secure bcrypt hash; we never expose it in responses.
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    // Role differentiates Admin/HR and Student permissions for route protection.
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student"
    },
    // Profile fields displayed on the "Profile Update" page for Students.
    headline: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    skills: [
      {
        type: String,
        trim: true
      }
    ],
    // These fields store Cloudinary URLs for resume and optional cover letter uploads.
    resumeUrl: {
      type: String,
      trim: true
    },
    coverLetterUrl: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// This pre-save hook automatically hashes passwords whenever they are created or changed.
// It keeps authentication secure without requiring manual hashing calls in controllers.
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw(error);
  }
});

// This instance method compares a plain-text password to the hashed password on the user.
// It is used during login to verify credentials safely.
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model("User", userSchema);

