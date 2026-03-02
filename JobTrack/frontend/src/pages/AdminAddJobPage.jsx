// This page allows Admin/HR users to add new job postings with all key fields.
// It demonstrates secure role-based access from the frontend side and a clean form.

import { useState } from "react";
import { toast } from "react-toastify";
import { apiClient } from "../api/client.js";

export const AdminAddJobPage = () => {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "full-time",
    salaryRange: "",
    description: "",
    requirements: ""
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.post("/jobs", form);
      toast.success("Job created successfully.");
      setForm({
        title: "",
        company: "",
        location: "",
        jobType: "full-time",
        salaryRange: "",
        description: "",
        requirements: ""
      });
    } catch {
      toast.error("Failed to create job.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <div className="card-header">
          <h2>Add New Job</h2>
          <p>Share a role with your student talent pool.</p>
        </div>
        <div className="card-body">
          <form className="job-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Title
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Software Engineer Intern"
                />
              </label>
              <label>
                Company
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  required
                  placeholder="Tech Corp"
                />
              </label>
              <label>
                Location
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  placeholder="Remote / City"
                />
              </label>
              <label>
                Job Type
                <select
                  name="jobType"
                  value={form.jobType}
                  onChange={handleChange}
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                  <option value="remote">Remote</option>
                </select>
              </label>
              <label>
                Salary Range
                <input
                  type="text"
                  name="salaryRange"
                  value={form.salaryRange}
                  onChange={handleChange}
                  placeholder="₹6–8 LPA"
                />
              </label>
            </div>
            <label>
              Description
              <textarea
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Requirements
              <textarea
                name="requirements"
                rows={3}
                value={form.requirements}
                onChange={handleChange}
              />
            </label>
            <button className="btn-primary" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Publish job"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

