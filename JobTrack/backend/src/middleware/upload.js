// This middleware wraps Multer to handle file uploads (e.g., resumes and cover letters).
// It stores files temporarily in memory so they can be streamed directly to Cloudinary
// without ever touching disk, which is more secure and cloud-friendly.

import multer from "multer";

// `memoryStorage` keeps files in RAM buffers, ideal for passing into Cloudinary helpers.
const storage = multer.memoryStorage();

// We restrict uploads to reasonably sized files to protect the server.
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

