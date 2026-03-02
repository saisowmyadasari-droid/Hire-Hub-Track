// This page lets Students update their profile information and upload
// resume / cover letter files to Cloudinary via the backend API.

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiClient } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { SkeletonBlock } from "../components/common/SkeletonBlock.jsx";

export const ProfilePage = () => {
  const { user, } = useAuth();
  const [form, setForm] = useState({
    headline: "",
    location: "",
    phone: "",
    skills: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetterFile, setCoverLetterFile] = useState(null);

  // Initialize form fields from the current user profile when present.
  useEffect(() => {
    if (user) {
      setForm({
        headline: user.headline || "",
        location: user.location || "",
        phone: user.phone || "",
        skills: (user.skills || []).join(", ")
      });
      setLoading(false);
    }
  }, [user]);

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
      const formData = new FormData();
      formData.append("headline", form.headline);
      formData.append("location", form.location);
      formData.append("phone", form.phone);
      formData.append("skills", form.skills);

      if (resumeFile) {
        formData.append("resume", resumeFile);
      }
      if (coverLetterFile) {
        formData.append("coverLetter", coverLetterFile);
      }

      await apiClient.put("/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success("Profile updated successfully.");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <div className="card-header">
          <h2>Profile & Documents</h2>
          <p>Keep your information and resume up to date.</p>
        </div>
        <div className="card-body">
          {loading ? (
            <SkeletonBlock height={160} />
          ) : (
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>
                  Headline
                  <input
                    type="text"
                    name="headline"
                    value={form.headline}
                    onChange={handleChange}
                    placeholder="Final year CS student..."
                  />
                </label>
                <label>
                  Location
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Hyderabad, India"
                  />
                </label>
                <label>
                  Phone
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91-XXXXXXXXXX"
                  />
                </label>
                <label>
                  Skills
                  <input
                    type="text"
                    name="skills"
                    value={form.skills}
                    onChange={handleChange}
                    placeholder="React, Node.js, MongoDB"
                  />
                </label>
              </div>

              <div className="upload-row">
                <div>
                  <label>
                    Resume (PDF)
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                    />
                  </label>
                  {user?.resumeUrl && (
                    <p className="muted">
                      Current:{" "}
                      <a
                        href={user.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View uploaded resume
                      </a>
                    </p>
                  )}
                </div>
                <div>
                  <label>
                    Cover Letter (optional)
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setCoverLetterFile(e.target.files[0])}
                    />
                  </label>
                  {user?.coverLetterUrl && (
                    <p className="muted">
                      Current:{" "}
                      <a
                        href={user.coverLetterUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View uploaded cover letter
                      </a>
                    </p>
                  )}
                </div>
              </div>

              <button className="btn-primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

