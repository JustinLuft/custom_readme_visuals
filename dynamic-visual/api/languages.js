import { createCanvas, loadImage, registerFont } from "canvas";
import fetch from "node-fetch";
import { Octokit } from "octokit";
import 'dotenv/config';
import path from "path";
import fs from "fs";

// Ensure the font file exists
const fontPath = path.join(process.cwd(), "fonts", "CourierNewBold.ttf");
console.log("Font exists?", fs.existsSync(fontPath), fontPath);

// Register font
registerFont(
  path.join(process.cwd(), "dynamic-visual", "fonts", "CourierNewBold.ttf"),
  { family: "CourierNewBold" }
);

export default async function handler(req, res) {
  const username = req.query.username || "JustinLuft";
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  try {
    // --- Fetch user data ---
    const { data: user } = await octokit.rest.users.getByUsername({ username });

    // --- Fetch repos to compute top languages and total stars ---
    const repos = await octokit.paginate(octokit.rest.repos.listForUser, {
      username,
      per_page: 100,
      sort: "updated",
    });

    const langTotals = {};
    let totalStars = 0;
    
    for (const repo of repos) {
      totalStars += repo.stargazers_count;
      if (!repo.language) continue;
      langTotals[repo.language] = (langTotals[repo.language] || 0) + 1;
    }

    const sortedLangs = Object.entries(langTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4); // Top 4 languages

    // --- Canvas setup ---
    const width = 1000,
      height = 450;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // --- Enhanced Background ---
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#0a0a1a");
    gradient.addColorStop(0.3, "#1a0a2e");
    gradient.addColorStop(0.7, "#16213e");
    gradient.addColorStop(1, "#0f0f1e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Animated-style grid with glow
    ctx.strokeStyle = "rgba(0,255,255,0.08)";
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // --- Stats display (no header) ---
    ctx.font = "28px CourierNewBold";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`📦 ${user.public_repos} Repositories`, 80, 60);
    
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText(" │", 380, 60);
    
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`⭐ ${totalStars} Total Stars`, 420, 60);

    // Separator line
    const lineGrad = ctx.createLinearGradient(80, 100, 920, 100);
    lineGrad.addColorStop(0, "#00ffff");
    lineGrad.addColorStop(0.5, "#ff00ff");
    lineGrad.addColorStop(1, "#00ffff");
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 2;
    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(80, 100);
    ctx.lineTo(920, 100);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // --- Language bars with header ---
    const langHeaderY = 130;
    
    // Section header
    ctx.save();
    ctx.shadowColor = "#ff00ff";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#ff00ff";
    ctx.font = "bold 28px CourierNewBold";
    ctx.fillText("MOST USED LANGUAGES", 80, langHeaderY);
    ctx.shadowBlur = 0;
    ctx.restore();
    
    let barY = 180;
    const barX = 80;
    const maxBarWidth = 840;
    const barHeight = 28;
    const barSpacing = 75;
    const maxCount = sortedLangs[0] ? sortedLangs[0][1] : 1;

    for (let i = 0; i < sortedLangs.length; i++) {
      const [lang, count] = sortedLangs[i];
      const percentage = ((count / maxCount) * 100).toFixed(0);
      const barLen = (count / maxCount) * maxBarWidth;

      // Background bar (darker)
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.fillRect(barX, barY, maxBarWidth, barHeight);

      // Foreground bar with gradient
      const barGrad = ctx.createLinearGradient(barX, barY, barX + barLen, barY);
      barGrad.addColorStop(0, "#00ffff");
      barGrad.addColorStop(0.5, "#00d4ff");
      barGrad.addColorStop(1, "#ff00ff");

      ctx.save();
      ctx.fillStyle = barGrad;
      ctx.shadowColor = "#00ffff";
      ctx.shadowBlur = 20;
      ctx.fillRect(barX, barY, barLen, barHeight);
      ctx.restore();

      // Border on the bar
      ctx.strokeStyle = "rgba(0,255,255,0.5)";
      ctx.lineWidth = 1;
      ctx.strokeRect(barX, barY, maxBarWidth, barHeight);

      // Language name
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px CourierNewBold";
      ctx.fillText(lang, barX, barY - 8);

      // Percentage and count
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "18px CourierNewBold";
      ctx.textAlign = "right";
      ctx.fillText(`${count} repos (${percentage}%)`, barX + maxBarWidth, barY - 8);
      ctx.textAlign = "left";

      barY += barSpacing;
    }

    // --- Output image ---
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    canvas.pngStream().pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating stats visual.");
  }
}
