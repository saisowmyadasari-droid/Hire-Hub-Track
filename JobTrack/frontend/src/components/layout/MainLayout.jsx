// This layout component defines the main shell of the app: sidebar, header,
// and content area. It gives the project a professional structure and
// consistent visual framing across Student and Admin views.

import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export const MainLayout = () => {
  const { user, logout } = useAuth();

  // This helper renders navigation links conditionally based on user role.
  const renderLinks = () => {
    if (!user) return null;

    if (user.role === "admin") {
      return (
        <>
          <NavLink to="/admin/jobs" className="nav-link">
            Add Job
          </NavLink>
          <NavLink to="/admin/applications" className="nav-link">
            Received Resumes
          </NavLink>
        </>
      );
    }

    return (
      <>
        <NavLink to="/dashboard" className="nav-link">
          Stats
        </NavLink>
        <NavLink to="/jobs" className="nav-link">
          Jobs
        </NavLink>
        <NavLink to="/profile" className="nav-link">
          Profile
        </NavLink>
      </>
    );
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo-block">
          <span className="logo-mark">JT</span>
          <span className="logo-text">JobTracker Pro</span>
        </div>
        <nav className="nav-menu">{renderLinks()}</nav>
      </aside>
      <div className="main-panel">
        <header className="top-bar">
          <div className="top-bar-left">
            <h1 className="app-title">
              {user?.role === "admin" ? "Admin / HR Portal" : "Student Portal"}
            </h1>
            <p className="app-subtitle">
              Track applications, decisions, and jobs with a clean workflow.
            </p>
          </div>
          <div className="top-bar-right">
            {user && (
              <>
                <div className="user-chip">
                  <span className="user-name">{user.name}</span>
                  <span className="user-role">{user.role}</span>
                </div>
                <button className="btn-secondary" onClick={logout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </header>
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

