// This file centralizes the MongoDB connection logic using Mongoose so
// the rest of the app can import a single helper to connect to the database.
// Keeping it in `config` makes the connection details easy to manage and reuse.

import mongoose from "mongoose";

// This helper connects to MongoDB using the URL from the environment.
// It throws a clear error if the URL is missing or the connection fails.
export const connectDB = async () => {
  const uri = process.env.MONGO_URL;

  if (!uri) {
    throw new Error(
      "MONGO_URL is not defined. Add it to your .env file to connect to MongoDB."
    );
  }

  try {
    // `mongoose.connect` returns a promise that resolves when the connection is ready.
    await mongoose.connect(uri, {
      // These options help keep the connection stable in most deployments.
      autoIndex: true
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB", error);
    // Exiting here prevents the server from running without a valid database.
    process.exit(1);
  }
};

