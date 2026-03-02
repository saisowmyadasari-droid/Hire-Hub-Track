// This router exposes application-related endpoints for Students and Admin.
// It backs the stats dashboard, "My Applications" list, and Admin "Received Resumes".

import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import {
  applyToJob,
  getMyApplications,
  getMyStats,
  listApplicationsForAdmin,
  updateApplicationStatus
} from "../controllers/applicationController.js";

export const applicationRouter = express.Router();

// Student endpoints for applying to jobs and viewing their own progress.
applicationRouter.post("/", requireAuth, requireRole("student"), applyToJob);
applicationRouter.get("/mine", requireAuth, requireRole("student"), getMyApplications);
applicationRouter.get("/stats", requireAuth, requireRole("student"), getMyStats);

// Admin endpoints for browsing and updating all received applications.
applicationRouter.get(
  "/admin",
  requireAuth,
  requireRole("admin"),
  listApplicationsForAdmin
);
applicationRouter.patch(
  "/admin/:applicationId/status",
  requireAuth,
  requireRole("admin"),
  updateApplicationStatus
);

