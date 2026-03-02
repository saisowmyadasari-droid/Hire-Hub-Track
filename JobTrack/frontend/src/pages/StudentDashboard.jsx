// This page is the main "Stats" dashboard for Students.
// It shows the bar chart for Applied / Rejected / Selected and a filterable list
// of applications below based on the clicked bar.

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiClient } from "../api/client.js";
import { StatsChart } from "../components/dashboard/StatsChart.jsx";
import { SkeletonBlock } from "../components/common/SkeletonBlock.jsx";

export const StudentDashboard = () => {
  const [stats, setStats] = useState({
    applied: 0,
    rejected: 0,
    selected: 0
  });
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState(null);

  // This effect fetches both stats and application list on initial load.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, appsRes] = await Promise.all([
          apiClient.get("/applications/stats"),
          apiClient.get("/applications/mine")
        ]);
        setStats(statsRes.data.stats);
        setApplications(appsRes.data.applications);
      } catch (error) {
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // This helper is called whenever the user clicks a bar in the chart.
  const handleBarClick = (statusKey) => {
    setFilterStatus(statusKey);
  };

  // This derived value filters applications based on the selected bar.
  const filteredApplications = applications.filter((app) => {
    if (!filterStatus) return true;
    if (filterStatus === "applied") {
      return app.computedStatus === "applied" || app.computedStatus === "pending";
    }
    return app.computedStatus === filterStatus;
  });

  return (
    <div className="page">
      <StatsChart stats={stats} onBarClick={handleBarClick} />
      <div className="card">
        <div className="card-header">
          <h2>My Applications</h2>
          <p>
            {filterStatus
              ? `Showing applications with status: ${filterStatus.toUpperCase()}`
              : "Showing all recent applications."}
          </p>
        </div>
        <div className="card-body list-container">
          {loading ? (
            <SkeletonBlock height={72} count={3} />
          ) : filteredApplications.length === 0 ? (
            <p className="empty-state">
              You have no applications yet. Apply to a job to see it here.
            </p>
          ) : (
            <ul className="application-list">
              {filteredApplications.map((app) => (
                <li key={app.id} className="application-item">
                  <div>
                    <h3>
                      {app.title} @ {app.company}
                    </h3>
                    <p className="muted">
                      {app.location} • {app.jobType}
                    </p>
                  </div>
                  <div className={`status-pill status-${app.computedStatus}`}>
                    {app.computedStatus.toUpperCase()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

