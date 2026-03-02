// This middleware file centralizes authentication and role-based access control.
// It verifies JWT tokens stored in HTTP-only cookies, attaches the user to `req`,
// and provides helpers to restrict routes to Admin or Student roles.

import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// This middleware checks for a JWT in the `token` cookie and verifies it.
// If valid, it fetches the user document and attaches it to `req.user`.
export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// This factory returns middleware that only allows specific roles to proceed.
// It is used to protect Admin-only routes like "Add Job" and "View Resumes".
export const requireRole =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied." });
    }
    next();
  };

