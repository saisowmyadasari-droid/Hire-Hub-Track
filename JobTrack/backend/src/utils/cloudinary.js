// This utility file encapsulates Cloudinary configuration and upload helpers.
// Centralizing this logic keeps controllers clean and makes it easy to swap
// to a different storage provider (like AWS S3) in the future.

import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config()

// Cloudinary is configured via environment variables for security:
// - CLOUDINARY_CLOUD_NAME
// - CLOUDINARY_API_KEY
// - CLOUDINARY_API_SECRET
// These values should never be hard-coded in source control.
export const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
};

// This helper uploads a file buffer to Cloudinary and returns the secure URL.
// We use the `resource_type: "auto"` so PDFs and images are both supported.
export const uploadToCloudinary = async (fileBuffer, folder = "resumes") => {
  if (!fileBuffer) {
    return null;
  }

  // Cloudinary expects either a file path or a base64 "data URI".
  const base64 = fileBuffer.toString("base64");
  const dataUri = `data:application/octet-stream;base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "auto"
  });

  return result.secure_url;
};

