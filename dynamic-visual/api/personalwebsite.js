import { createCanvas, registerFont } from "canvas";
import { GifEncoder } from "@skyra/gifenc";
import path from "path";
import fs from "fs";

// ----------------------
// FONT SETUP
// ----------------------
// Ensure the font file exists
const fontPath = path.join(process.cwd(), "fonts", "CourierNewBold.ttf");
console.log("Font exists?", fs.existsSync(fontPath), fontPath);

// Register font
registerFont(
  path.join(process.cwd(), "dynamic-visual", "fonts", "CourierNewBold.ttf"),
  { family: "CourierNewBold" }
);

// ----------------------
// GIF HANDLER
// ----------------------
export default async function handler(req, res) {
  try {
    // Scale up canvas to prevent serverless small-canvas issues
    const baseWidth = 220;
    const baseHeight = 50;
    const scale = 4; // scales up to 720x200
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

        // Background gradient
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, "#0a0a1a");
        bgGrad.addColorStop(1, "#1a0a2e");
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

        // Border with glow
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2 * scale;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10 * scale;
        ctx.strokeRect(2 * scale, 2 * scale, width - 4 * scale, height - 4 * scale);
        ctx.restore();

        // Corner cut
        ctx.fillStyle = "#0a0a1a";
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

        // Pulsing text
        const pulseIntensity = 15 + Math.sin(frameNum / 3) * 10;

        ctx.save();
        ctx.font = `${16 * scale}px CourierNewBold`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = color;
        ctx.shadowBlur = pulseIntensity * scale;
        ctx.fillStyle = color;
        ctx.fillText(text, width / 2, height / 2);
        ctx.shadowBlur = (pulseIntensity + 10) * scale;
        ctx.fillText(text, width / 2, height / 2);
        ctx.restore();

        // White overlay
        ctx.save();
        ctx.font = `${16 * scale}px CourierNewBold`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(text, width / 2, height / 2);
        ctx.restore();

        // Scanline
        const scanY = (frameNum / 20) * (height + 4 * scale) - 2 * scale;
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.fillRect(0, scanY, width, 2 * scale);

        // Add frame via canvas context (more stable than raw data)
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
