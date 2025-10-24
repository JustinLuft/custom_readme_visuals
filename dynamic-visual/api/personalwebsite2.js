import { createCanvas, registerFont } from "canvas";
import { GifEncoder } from "@skyra/gifenc";
import path from "path";
import fs from "fs";

// ----------------------
// FONT SETUP
// ----------------------
const fontPath = path.join(process.cwd(), "fonts", "CourierNewBold.ttf");
if (!fs.existsSync(fontPath)) {
  console.error("Font not found! Falling back to system font.");
}
registerFont(fontPath, { family: "CourierNewBold" });

// ----------------------
// GIF HANDLER
// ----------------------
export default async function handler(req, res) {
  try {
    // Canvas size and scaling
    const baseWidth = 220;
    const baseHeight = 50;
    const scale = 2; // reduced scale for faster rendering
    const width = baseWidth * scale;
    const height = baseHeight * scale;

    const text = "PERSONAL WEBSITE";
    const color = "#ff00ff";
    const colorRGB = "255, 0, 255";

    // Encoder
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

      // Reduce frames for faster rendering
      const totalFrames = 10;
      for (let frameNum = 0; frameNum < totalFrames; frameNum++) {
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        // Background gradient
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, "#0a0a1a");
        bgGrad.addColorStop(1, "#1a0a2e");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Border glow
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2 * scale;
        ctx.shadowColor = color;
        ctx.shadowBlur = 5 * scale;
        ctx.strokeRect(2 * scale, 2 * scale, width - 4 * scale, height - 4 * scale);
        ctx.restore();

        // Text with pulsing shadow
        const pulse = 10 + Math.sin(frameNum / 2) * 5;
        ctx.save();
        ctx.font = `${16 * scale}px CourierNewBold`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = pulse * scale;
        ctx.fillText(text, width / 2, height / 2);
        ctx.restore();

        // Scanline effect
        const scanY = (frameNum / totalFrames) * (height + 2 * scale) - scale;
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.fillRect(0, scanY, width, 2 * scale);

        encoder.addFrame(ctx);
      }

      encoder.finish();
    });

    const buffer = Buffer.concat(chunks);

    // ✅ Headers for GitHub caching
    res.setHeader("Content-Type", "image/gif");
    res.setHeader(
      "Cache-Control",
      "public, max-age=86400, stale-while-revalidate=43200"
    );

    res.send(buffer);
  } catch (err) {
    console.error(err);

    // ✅ Fallback GIF if something fails
    const fallbackPath = path.join(process.cwd(), "public", "fallback.gif");
    if (fs.existsSync(fallbackPath)) {
      res.setHeader("Content-Type", "image/gif");
      res.setHeader(
        "Cache-Control",
        "public, max-age=86400, stale-while-revalidate=43200"
      );
      res.send(fs.readFileSync(fallbackPath));
    } else {
      res.status(500).json({ error: "Failed to generate GIF" });
    }
  }
}
