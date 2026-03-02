// This router exposes job-related endpoints for both Admin and Students.
// - Admin: create new jobs.
// - Everyone: list jobs with search + filters + pagination.

import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { createJob, listJobs } from "../controllers/jobController.js";

export const jobRouter = express.Router();

// Everyone can query jobs (no auth required for basic browsing).
jobRouter.get("/", listJobs);

// Only Admin/HR users can create new jobs.
jobRouter.post("/", requireAuth, requireRole("admin"), createJob);

