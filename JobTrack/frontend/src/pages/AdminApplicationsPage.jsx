// This page gives Admin/HR a visual overview of all received resumes and
// applications, with filters, pagination, and quick actions to mark Selected
// or Rejected. Status coloring matches the student dashboard for consistency.

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiClient } from "../api/client.js";
import { SkeletonBlock } from "../components/common/SkeletonBlock.jsx";

export const AdminApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobType, setJobType] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchApplications = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/applications/admin", {
        params: {
          status: statusFilter,
          jobType,
          search,
          page,
          limit: 10,
          ...params
        }
      });
      setApplications(data.applications);
      setPage(data.page);
      setPages(data.pages);
    } catch {
      toast.error("Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, jobType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchApplications({ page: 1 });
  };

  const handleStatusChange = async (id, status) => {
    try {
      await apiClient.patch(`/applications/admin/${id}/status`, { status });
      toast.success(`Marked as ${status}.`);
      fetchApplications();
    } catch {
      toast.error("Failed to update status.");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <div className="card-header">
          <h2>Received Resumes & Applications</h2>
          <p>Review candidates and move them quickly to Selected or Rejected.</p>
        </div>
        <div className="card-body">
          <form className="jobs-filters" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search by candidate, job, or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="applied">Applied</option>
              <option value="pending">Pending</option>
              <option value="declined">Declined</option>
              <option value="selected">Selected</option>
              <option value="rejected">Rejected</option>
            </select>
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
              Filter
            </button>
          </form>
          {loading ? (
            <SkeletonBlock height={96} count={4} />
          ) : applications.length === 0 ? (
            <p className="empty-state">No applications found yet.</p>
          ) : (
            <ul className="application-list admin">
              {applications.map((app) => (
                <li key={app.id} className="application-item">
                  <div>
                    <h3>
                      {app.title} @ {app.company}
                    </h3>
                    <p className="muted">
                      {app.candidateName} • {app.candidateEmail}
                    </p>
                    {app.resumeUrl && (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="link"
                      >
                        View Resume
                      </a>
                    )}
                  </div>
                  <div className="admin-actions">
                    <div
                      className={`status-pill status-${app.computedStatus}`}
                    >
                      {app.computedStatus.toUpperCase()}
                    </div>
                    <div className="admin-buttons">
                      <button
                        className="btn-small success"
                        type="button"
                        onClick={() => handleStatusChange(app.id, "selected")}
                      >
                        Select
                      </button>
                      <button
                        className="btn-small danger"
                        type="button"
                        onClick={() => handleStatusChange(app.id, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
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

