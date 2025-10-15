import { createCanvas, registerFont } from "canvas";
import { GifEncoder } from "@skyra/gifenc";
import path from "path";
import fs from "fs";

// ----------------------
// FONT SETUP
// ----------------------
const fontPath = path.join(process.cwd(), "dynamic-visual", "fonts", "CourierNewBold.ttf");
if (!fs.existsSync(fontPath)) {
  throw new Error("Font file not found at " + fontPath);
}
registerFont(fontPath, { family: "CourierNewBold" });

// ----------------------
// CYBERPUNK PINK GIF HANDLER
// ----------------------
export default async function handler(req, res) {
  try {
    const baseWidth = 300;   // slightly bigger for longer text
    const baseHeight = 60;
    const scale = 4; // scales up to 1200x240
    const width = baseWidth * scale;
    const height = baseHeight * scale;

    const text = "PERSONAL WEBSITE";
    const color = "#ff00ff"; // neon pink
    const colorRGB = "255, 0, 255";

    const encoder = new GifEncoder(width, height);
    const chunks = [];
    const stream = encoder.createReadStream();
    stream.on("data", (chunk) => chunks.push(chunk));

    await new Promise((resolve, reject) => {
      stream.on("end", resolve);
      stream.on("error", reject);

      encoder.setDelay(100);
      encoder.setRepeat(0);
      encoder.start();

      for (let frameNum = 0; frameNum < 20; frameNum++) {
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        // Background gradient (cyberpunk purple)
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, "#1a001a");
        bgGrad.addColorStop(1, "#300030");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Grid
        ctx.strokeStyle = `rgba(${colorRGB}, 0.08)`;
        ctx.lineWidth = 0.5 * scale;
        for (let i = 0; i < height; i += 10 * scale) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(width, i);
          ctx.stroke();
        }

        // Border with pink glow
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2 * scale;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10 * scale;
        ctx.strokeRect(2 * scale, 2 * scale, width - 4 * scale, height - 4 * scale);
        ctx.restore();

        // Corner cut
        ctx.fillStyle = "#1a001a";
        ctx.beginPath();
        ctx.moveTo(width - 12 * scale, height - 2 * scale);
        ctx.lineTo(width - 2 * scale, height - 2 * scale);
        ctx.lineTo(width - 2 * scale, height - 12 * scale);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = color;
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        ctx.moveTo(width - 12 * scale, height - 2 * scale);
        ctx.lineTo(width - 2 * scale, height - 12 * scale);
        ctx.stroke();

        // Pulsing neon text
        const pulseIntensity = 15 + Math.sin(frameNum / 3) * 10;

        ctx.save();
        ctx.font = `${18 * scale}px CourierNewBold`; // slightly bigger font for longer text
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = color;
        ctx.shadowBlur = pulseIntensity * scale;
        ctx.fillStyle = color;
        ctx.fillText(text, width / 2, height / 2);
        ctx.shadowBlur = (pulseIntensity + 10) * scale;
        ctx.fillText(text, width / 2, height / 2);
        ctx.restore();

        // White overlay for highlight
        ctx.save();
        ctx.font = `${18 * scale}px CourierNewBold`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(text, width / 2, height / 2);
        ctx.restore();

        // Scanline effect
        const scanY = (frameNum / 20) * (height + 4 * scale) - 2 * scale;
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.fillRect(0, scanY, width, 2 * scale);

        // Add frame via canvas context
        encoder.addFrame(ctx);
      }

      encoder.finish();
    });

    const buffer = Buffer.concat(chunks);
    res.setHeader("Content-Type", "image/gif");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(buffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
