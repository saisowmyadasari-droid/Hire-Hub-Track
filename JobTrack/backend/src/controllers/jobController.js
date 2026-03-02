// This controller provides job-related endpoints for both Admin and Students.
// - Admin can create jobs.
// - Everyone can browse jobs with advanced filtering + pagination.

import { Job } from "../models/Job.js";

// This handler lets an Admin/HR create a new job posting.
export const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      jobType,
      description,
      requirements,
      salaryRange
    } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      jobType,
      description,
      requirements,
      salaryRange,
      createdBy: req.user.id
    });

    return res.status(201).json({
      message: "Job created successfully.",
      job
    });
  } catch (error) {
    console.error("Create job error:", error);
    return res.status(500).json({ message: "Failed to create job." });
  }
};

// This handler returns a paginated, filterable list of jobs.
// Query parameters:
// - search: text search across title, company, and location
// - jobType: filter by job type
// - page: page number (1-based)
// - limit: page size (default 10)
export const listJobs = async (req, res) => {
  try {
    const {
      search = "",
      jobType,
      page = 1,
      limit = 10
    } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } }
      ];
    }

    if (jobType && jobType !== "all") {
      query.jobType = jobType;
    }

    const numericPage = Number(page) || 1;
    const numericLimit = Number(limit) || 10;
    const skip = (numericPage - 1) * numericLimit;

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(numericLimit),
      Job.countDocuments(query)
    ]);

    return res.json({
      jobs,
      total,
      page: numericPage,
      pages: Math.ceil(total / numericLimit)
    });
  } catch (error) {
    console.error("List jobs error:", error);
    return res.status(500).json({ message: "Failed to fetch jobs." });
  }
};

