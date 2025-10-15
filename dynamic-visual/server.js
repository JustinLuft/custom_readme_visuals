import express from "express";

// ----------------------
// IMPORT API HANDLERS
// ----------------------
import connectHandler from "./api/connect.js";
import personalWebsiteHandler from "./api/personal-website.js";
import headerHandler from "./api/header.js";
import languagesHandler from "./api/languages.js";

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
  connect: connectHandler,
  "personal-website": personalWebsiteHandler,
  header: headerHandler,
  languages: languagesHandler,
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
