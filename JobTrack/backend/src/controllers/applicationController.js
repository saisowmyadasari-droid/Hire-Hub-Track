// This controller manages job applications from students and review actions from Admin.
// It also powers the statistics dashboard for students by aggregating application statuses.

import { Application } from "../models/Application.js";
import { Job } from "../models/Job.js";
import { User } from "../models/User.js";

// Helper to build a consistent shape for application responses used on both dashboards.
const mapApplication = (app) => ({
  id: app._id,
  jobId: app.job?._id,
  title: app.job?.title,
  company: app.job?.company,
  location: app.job?.location,
  jobType: app.job?.jobType,
  candidateName: app.candidate?.name,
  candidateEmail: app.candidate?.email,
  resumeUrl: app.resumeUrlSnapshot || app.candidate?.resumeUrl,
  appliedAt: app.appliedAt,
  status: app.status,
  computedStatus: app.computedStatus
});

// This handler lets a student apply to a job.
// It creates an Application document and captures a resume URL snapshot for reliability.
export const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: "Job not found." });
    }

    const candidate = await User.findById(req.user.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found." });
    }

    const alreadyApplied = await Application.findOne({
      candidate: candidate._id,
      job: job._id
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: "You already applied to this job." });
    }

    const application = await Application.create({
      candidate: candidate._id,
      job: job._id,
      appliedAt: new Date(),
      resumeUrlSnapshot: candidate.resumeUrl
    });

    return res.status(201).json({
      message: "Job applied successfully.",
      applicationId: application._id
    });
  } catch (error) {
    console.error("Apply to job error:", error);
    return res.status(500).json({ message: "Failed to apply for job." });
  }
};

// This handler returns a student's own applications for the dashboard list and stats.
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      candidate: req.user.id
    })
      .populate("job")
      .populate("candidate");

    return res.json({
      applications: applications.map(mapApplication)
    });
  } catch (error) {
    console.error("Get my applications error:", error);
    return res.status(500).json({ message: "Failed to fetch applications." });
  }
};

// This handler aggregates application counts for the student stats bar chart.
// It separates:
// - applied (within 6 days)
// - pending (applied >=6 days and <12 days)
// - declined (applied >=12 days)
// - selected
// - rejected
export const getMyStats = async (req, res) => {
  try {
    const applications = await Application.find({
      candidate: req.user.id
    });

    let applied = 0;
    let pending = 0;
    let declined = 0;
    let selected = 0;
    let rejected = 0;

    applications.forEach((app) => {
      const status = app.computedStatus;

      if (status === "selected") selected += 1;
      else if (status === "rejected") rejected += 1;
      else if (status === "pending") pending += 1;
      else if (status === "declined") declined += 1;
      else if (status === "applied") applied += 1;
    });

    return res.json({
      stats: {
        applied,
        pending,
        declined,
        selected,
        rejected
      }
    });
  } catch (error) {
    console.error("Get my stats error:", error);
    return res.status(500).json({ message: "Failed to fetch stats." });
  }
};

// This handler gives Admins a paginated, filterable view of all applications and resumes.
// It powers the "Received Resumes" admin dashboard.
export const listApplicationsForAdmin = async (req, res) => {
  try {
    const {
      status,
      jobType,
      search = "",
      page = 1,
      limit = 10
    } = req.query;

    const baseQuery = {};

    if (status && status !== "all") {
      if (status === "pending" || status === "declined") {
        baseQuery.status = "applied";
      } else {
        baseQuery.status = status;
      }
    }

    const numericPage = Number(page) || 1;
    const numericLimit = Number(limit) || 10;
    const skip = (numericPage - 1) * numericLimit;

    let applications = await Application.find(baseQuery)
      .populate("job")
      .populate("candidate")
      .sort({ createdAt: -1 });

    if (jobType && jobType !== "all") {
      applications = applications.filter(
        (app) => app.job?.jobType === jobType
      );
    }

    if (search) {
      const term = search.toLowerCase();
      applications = applications.filter((app) => {
        const name = app.candidate?.name?.toLowerCase() || "";
        const email = app.candidate?.email?.toLowerCase() || "";
        const title = app.job?.title?.toLowerCase() || "";
        const company = app.job?.company?.toLowerCase() || "";
        return (
          name.includes(term) ||
          email.includes(term) ||
          title.includes(term) ||
          company.includes(term)
        );
      });
    }

    const total = applications.length;
    const paged = applications.slice(skip, skip + numericLimit);

    return res.json({
      applications: paged.map(mapApplication),
      total,
      page: numericPage,
      pages: Math.ceil(total / numericLimit)
    });
  } catch (error) {
    console.error("List applications for admin error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch applications for admin." });
  }
};

// This handler lets an Admin move an application to "selected" or "rejected".
// Once changed, the computed status will always mirror this explicit decision.
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!["selected", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be either 'selected' or 'rejected'."
      });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    application.status = status;
    await application.save();

    return res.json({
      message: "Application status updated.",
      applicationId: application._id,
      status: application.status
    });
  } catch (error) {
    console.error("Update application status error:", error);
    return res.status(500).json({ message: "Failed to update status." });
  }
};

