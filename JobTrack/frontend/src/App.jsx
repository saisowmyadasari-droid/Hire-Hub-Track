// This component defines the main routing structure of the React application.
// It connects authentication-aware routes for both Student and Admin roles and
// hooks in the global layout and toast notifications.

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { MainLayout } from "./components/layout/MainLayout.jsx";
import { AuthPage } from "./pages/AuthPage.jsx";
import { StudentDashboard } from "./pages/StudentDashboard.jsx";
import { JobsPage } from "./pages/JobsPage.jsx";
import { ProfilePage } from "./pages/ProfilePage.jsx";
import { AdminAddJobPage } from "./pages/AdminAddJobPage.jsx";
import { AdminApplicationsPage } from "./pages/AdminApplicationsPage.jsx";

// This wrapper ensures that only logged-in users can access certain pages.
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-gate">Loading your workspace...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<AuthPage />} />
    <Route
      path="/"
      element={
        <PrivateRoute>
          <MainLayout />
        </PrivateRoute>
      }
    >
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route
        path="dashboard"
        element={
          <PrivateRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="jobs"
        element={
          <PrivateRoute allowedRoles={["student"]}>
            <JobsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="profile"
        element={
          <PrivateRoute allowedRoles={["student"]}>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="admin/jobs"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminAddJobPage />
          </PrivateRoute>
        }
      />
      <Route
        path="admin/applications"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminApplicationsPage />
          </PrivateRoute>
        }
      />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
