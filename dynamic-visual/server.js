import express from "express";

// Import your API route handlers
import connectHandler from "./api/connect.js";
import headerHandler from "./api/header.js";
import languagesHandler from "./api/languages.js";

const app = express();

// Routes for your visuals
app.get("/api/connect", async (req, res) => {
  await connectHandler(req, res);
});

app.get("/api/header", async (req, res) => {
  await headerHandler(req, res);
});

app.get("/api/languages", async (req, res) => {
  await languagesHandler(req, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/`);
  console.log("Available routes:");
  console.log("  /api/connect");
  console.log("  /api/header");
  console.log("  /api/languages");
});
