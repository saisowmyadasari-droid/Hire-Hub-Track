// This is the main entrypoint for the backend API server.
// It wires together configuration, middleware, routes, and database connection
// to provide a clean, professional Express + MongoDB stack.

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
// Load environment variables from `.env` at startup so config is centralized.
dotenv.config();

import { configureCloudinary } from "./utils/cloudinary.js";


import { v2 as cloudinary } from 'cloudinary';



import { connectDB } from "./config/db.js";
import { authRouter } from "./routes/authRoutes.js";
import { profileRouter } from "./routes/profileRoutes.js";
import { jobRouter } from "./routes/jobRoutes.js";
import { applicationRouter } from "./routes/applicationRoutes.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



// Initialize shared integrations like MongoDB and Cloudinary at boot time.
await connectDB();
configureCloudinary();

console.log("Cloudinary Cloud Name:", cloudinary.config().cloud_name);

const app = express();

// CORS configuration allows the React frontend to call the API securely.
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true
  })
);

// These middlewares make JSON payloads, cookies, and URL-encoded bodies available on `req`.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// All API routes are grouped under `/api` for clarity and future versioning.
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/applications", applicationRouter);

// A simple health-check route makes it easy to verify deployments.
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Centralized error handler keeps unexpected errors from leaking implementation details.
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Something went wrong on the server." });
});

const PORT = process.env.PORT || 5001;

// Starting the HTTP server completes the backend bootstrap process.
app.listen(PORT, () => {
  console.log(`🚀 API server listening on port ${PORT}`);
});

