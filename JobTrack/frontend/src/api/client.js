// This file centralizes Axios configuration for talking to the Express backend.
// Using a single client makes it easy to attach credentials and change the base URL.

import axios from "axios";

// The baseURL points to the backend server; in production you can override this
// with an environment variable via Vite's `import.meta.env`.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  withCredentials: true
});

