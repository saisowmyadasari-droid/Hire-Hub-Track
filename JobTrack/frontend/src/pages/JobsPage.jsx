// This page lists all jobs created by Admin/HR and lets Students search, filter,
// paginate, and apply to them. It demonstrates professional UX with a search bar,
// job-type filter, and page controls.

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiClient } from "../api/client.js";
import { SkeletonBlock } from "../components/common/SkeletonBlock.jsx";

export const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("all");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchJobs = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/jobs", {
        params: {
          search,
          jobType,
          page,
          limit: 10,
          ...params
        }
      });
      setJobs(data.jobs);
      setPage(data.page);
      setPages(data.pages);
    } catch (error) {
      toast.error("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, jobType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs({ page: 1 });
  };

  const handleApply = async (jobId) => {
    try {
      await apiClient.post("/applications", { jobId });
      toast.success("Job applied successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to apply for job.");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <div className="card-header">
          <h2>Available Jobs</h2>
          <p>Browse roles shared by your Admin/HR team.</p>
        </div>
        <div className="card-body">
          <form className="jobs-filters" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search by title, company, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
            </select>
            <button className="btn-secondary" type="submit">
              Search
            </button>
          </form>
          {loading ? (
            <SkeletonBlock height={96} count={4} />
          ) : jobs.length === 0 ? (
            <p className="empty-state">No jobs match your criteria yet.</p>
          ) : (
            <ul className="job-list">
              {jobs.map((job) => (
                <li key={job._id} className="job-item">
                  <div className="job-main">
                    <h3>
                      {job.title} @ {job.company}
                    </h3>
                    <p className="muted">
                      {job.location} • {job.jobType} • Posted{" "}
                      {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                    <p className="job-description">{job.description}</p>
                  </div>
                  <div className="job-actions">
                    <button
                      className="btn-primary"
                      type="button"
                      onClick={() => handleApply(job._id)}
                    >
                      Apply
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {pages > 1 && (
            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>
              <span>
                Page {page} of {pages}
              </span>
              <button
                disabled={page === pages}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

