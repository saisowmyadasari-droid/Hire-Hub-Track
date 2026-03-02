// This router wires up authentication-related endpoints under a clean URL namespace.
// Keeping routes in a dedicated file makes the server entrypoint easier to read.

import express from "express";
import { register, login, logout, getMe } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

export const authRouter = express.Router();

// Public routes for registering and logging in.
authRouter.post("/register", register);
authRouter.post("/login", login);

// Authenticated routes for logout and "who am I?" queries.
authRouter.post("/logout", requireAuth, logout);
authRouter.get("/me", requireAuth, getMe);

