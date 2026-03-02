// This controller file groups all authentication-related handlers:
// - registration
// - login
// - fetching the current profile ("me")
// It uses JWT + HTTP-only cookies to secure the session in a professional way.

import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// Helper to generate a signed JWT containing user id and role.
// The token is later stored in an HTTP-only cookie.
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// This helper standardizes the cookie and JSON response sent after auth events.
// It keeps payloads consistent across register and login.
const sendAuthResponse = (res, user, message) => {
  const token = generateToken(user);

  // HTTP-only cookie prevents JavaScript access and mitigates XSS token theft.
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return res.json({
    message,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      headline: user.headline,
      location: user.location,
      phone: user.phone,
      skills: user.skills,
      resumeUrl: user.resumeUrl,
      coverLetterUrl: user.coverLetterUrl
    }
  });
};

// This handler registers a new user (Student by default).
// For demo purposes, an Admin can be created by passing `role: "admin"` in the body,
// but in a real system you would restrict this to a seed process or special invite.
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role === "admin" ? "admin" : "student"
    });

    return sendAuthResponse(res, user, "Registered successfully.");
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Failed to register user." });
  }
};

// This handler logs a user in by verifying their credentials.
// On success, an HTTP-only cookie is set to maintain the session.
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const matches = await user.comparePassword(password);
    if (!matches) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    return sendAuthResponse(res, user, "Logged in successfully.");
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Failed to log in." });
  }
};

// This handler clears the auth cookie to log the user out.
export const logout = (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Logged out successfully." });
};

// This handler returns the currently authenticated user's profile.
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return res.json({ user });
  } catch (error) {
    console.error("Get me error:", error);
    return res.status(500).json({ message: "Failed to fetch profile." });
  }
};

