// This page hosts both login and registration forms for Admin and Student users.
// It provides a modern split layout with subtle animation so the first impression
// of the portal feels professional.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext.jsx";

export const AuthPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
        toast.success("Logged in successfully.");
      } else {
        await register(form);
        toast.success("Account created successfully.");
      }
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-panel auth-panel-left">
        <h1>JobTracker Pro</h1>
        <p>
          A professional portal for Students and HR teams to track every
          application, decision, and resume with clarity.
        </p>
        <ul className="auth-highlights">
          <li>Real-time status with smart Pending/Declined logic.</li>
          <li>Secure JWT-based authentication in HTTP-only cookies.</li>
          <li>Cloud-hosted resumes and cover letters.</li>
        </ul>
      </div>
      <div className="auth-panel auth-panel-right">
        <div className="auth-toggle">
          <button
            className={mode === "login" ? "auth-tab active" : "auth-tab"}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={mode === "register" ? "auth-tab active" : "auth-tab"}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <label>
                Full Name
                <input
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
              </label>
              <label>
                Role
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            </>
          )}
          <label>
            Email
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
            />
          </label>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Sign in"
              : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
};

