// This router exposes endpoints for viewing and updating the student's profile.
// It supports multipart form-data uploads for resume and cover letter.

import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { updateProfile } from "../controllers/profileController.js";

export const profileRouter = express.Router();

// We use `.fields` so the frontend can send both resume and coverLetter in a single request.
profileRouter.put(
  "/",
  requireAuth,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 }
  ]),
  updateProfile
);

