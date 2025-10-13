import express from "express";

// Import your API route handlers
import connectHandler from "./api/connect.js";
import headerHandler from "./api/header.js";
import languagesHandler from "./api/languages.js";

const app = express();

// Middleware to check if GitHub token is loaded
app.use((req, res, next) => {
  if (!process.env.GITHUB_TOKEN) {
    console.warn("⚠️ GITHUB_TOKEN is not set!");
  } else {
    console.log("✅ GITHUB_TOKEN loaded.");
  }
  next();
});

// Wrapper to log API requests and catch errors
const withLogging = (handler, name) => async (req, res) => {
  console.log(`➡️ Request to /api/${name}`);
  try {
    await handler(req, res);
  } catch (err) {
    console.error(`❌ Error in /api/${name}:`, err);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Routes for your visuals
app.get("/api/connect", withLogging(connectHandler, "connect"));
app.get("/api/header", withLogging(headerHandler, "header"));
app.get("/api/languages", withLogging(languagesHandler, "languages"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/`);
  console.log("Available routes:");
  console.log("  /api/connect");
  console.log("  /api/header");
  console.log("  /api/languages");
});
