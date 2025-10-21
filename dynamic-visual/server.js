import express from "express";

// ----------------------
// IMPORT API HANDLERS
// ----------------------
import linkedinHandler from "./api/connect.js"; // LinkedIn visual
import personalWebsiteHandler from "./api/personalwebsite.js"; // personalwebsite visual
import headerHandler from "./api/header.js";
import languagesHandler from "./api/languages.js";
import line1Handler from "./api/line1.js"; //blue line

const app = express();

// ----------------------
// GITHUB TOKEN CHECK
// ----------------------
app.use((req, res, next) => {
  if (!process.env.GITHUB_TOKEN) {
    console.warn("⚠️ GITHUB_TOKEN is not set!");
  } else {
    console.log("✅ GITHUB_TOKEN loaded.");
  }
  next();
});

// ----------------------
// HELPER: Wrap handler with logging & error handling
// ----------------------
const withLogging = (handler, name) => async (req, res) => {
  console.log(`➡️ Request to /api/${name}`);
  try {
    await handler(req, res);
  } catch (err) {
    console.error(`❌ Error in /api/${name}:`, err);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// ----------------------
// ROUTES CONFIGURATION
// ----------------------
const routes = {
  linkedin: linkedinHandler,       // LinkedIn visual
  personalwebsite: personalWebsiteHandler, // Personal Website visual (no dash)
  header: headerHandler,           // GitHub header visual
  languages: languagesHandler,     // GitHub languages visual
  line1: line1Handler,
  // Add new visuals here:
  // "new-visual-name": newHandler,
};

// Automatically register all routes
for (const [routeName, handler] of Object.entries(routes)) {
  app.get(`/api/${routeName}`, withLogging(handler, routeName));
}

// ----------------------
// START SERVER
// ----------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/`);
  console.log("Available routes:");
  for (const routeName of Object.keys(routes)) {
    console.log(`  /api/${routeName}`);
  }
});
