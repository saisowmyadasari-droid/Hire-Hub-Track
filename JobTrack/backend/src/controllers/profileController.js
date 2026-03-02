// This controller handles profile view/update for students, including resume
// and cover letter uploads to Cloudinary. It powers the "Profile Update" page.

import { User } from "../models/User.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

// This handler updates basic profile fields and optionally uploads resume/cover letter.
export const updateProfile = async (req, res) => {
  try {
    const { headline, location, phone, skills } = req.body;

    // We start from the currently authenticated user.
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.headline = headline ?? user.headline;
    user.location = location ?? user.location;
    user.phone = phone ?? user.phone;

    if (skills) {
      // Accepts a comma-separated string or an array and normalizes to trimmed array.
      const parsedSkills = Array.isArray(skills)
        ? skills
        : skills.split(",").map((s) => s.trim());
      user.skills = parsedSkills.filter(Boolean);
    }

    // Multer (upload middleware) places files on `req.files` when using `.fields`.
    const resumeFile = req.files?.resume?.[0];
    const coverLetterFile = req.files?.coverLetter?.[0];

    if (resumeFile) {
      user.resumeUrl = await uploadToCloudinary(resumeFile.buffer, "resumes");
    }

    if (coverLetterFile) {
      user.coverLetterUrl = await uploadToCloudinary(
        coverLetterFile.buffer,
        "cover-letters"
      );
    }

    await user.save();

    return res.json({
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        headline: user.headline,
        location: user.location,
        phone: user.phone,
        skills: user.skills,
        resumeUrl: user.resumeUrl,
        coverLetterUrl: user.coverLetterUrl
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Failed to update profile." });
  }
};

