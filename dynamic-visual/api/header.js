import { createCanvas, registerFont } from "canvas";
import { GifEncoder } from "@skyra/gifenc";
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
  try {
    const width = 1000;
    const height = 450;

    const encoder = new GifEncoder(width, height);
    const stream = encoder.createReadStream();

    res.setHeader("Content-Type", "image/gif");
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");

    encoder.setDelay(500);
    encoder.setRepeat(0);
    encoder.start();

    for (let frameNum = 0; frameNum < 2; frameNum++) {
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");
      const cycle = frameNum;

      const opacity1 = cycle === 0 ? 1 : 0.3;
      const opacity2 = cycle === 1 ? 1 : 0.3;
      const glowIntensity1 = cycle === 0 ? 40 : 10;
      const glowIntensity2 = cycle === 1 ? 40 : 10;

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#0a0a1a");
      gradient.addColorStop(0.3, "#1a0a2e");
      gradient.addColorStop(0.7, "#16213e");
      gradient.addColorStop(1, "#0f0f1e");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Grid
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

      const centerX = width / 2;
      const centerY = height / 2;

      // JUSTIN
      ctx.save();
      ctx.font = "bold 120px CourierNewBold"; // <— no quotes around the font name
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = `rgba(0, 255, 255, ${opacity1})`;
      ctx.shadowBlur = glowIntensity1;
      ctx.fillStyle = `rgba(0, 255, 255, ${opacity1})`;
      ctx.fillText("JUSTIN", centerX, centerY - 80);
      ctx.shadowBlur = glowIntensity1 + 20;
      ctx.fillText("JUSTIN", centerX, centerY - 80);
      ctx.shadowBlur = 0;
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity1})`;
      ctx.fillText("JUSTIN", centerX, centerY - 80);
      ctx.restore();

      // LUFT
      ctx.save();
      ctx.font = "bold 120px CourierNewBold"; // <— no quotes
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = `rgba(255, 0, 255, ${opacity2})`;
      ctx.shadowBlur = glowIntensity2;
      ctx.fillStyle = `rgba(255, 0, 255, ${opacity2})`;
      ctx.fillText("LUFT", centerX, centerY + 80);
      ctx.shadowBlur = glowIntensity2 + 20;
      ctx.fillText("LUFT", centerX, centerY + 80);
      ctx.shadowBlur = 0;
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity2})`;
      ctx.fillText("LUFT", centerX, centerY + 80);
      ctx.restore();

      // Top line
      const lineY1 = centerY - 150;
      ctx.save();
      const lineGrad1 = ctx.createLinearGradient(100, lineY1, width - 100, lineY1);
      lineGrad1.addColorStop(0, "rgba(0, 255, 255, 0)");
      lineGrad1.addColorStop(0.5, `rgba(0, 255, 255, ${opacity1})`);
      lineGrad1.addColorStop(1, "rgba(0, 255, 255, 0)");
      ctx.strokeStyle = lineGrad1;
      ctx.lineWidth = 2;
      ctx.shadowColor = `rgba(0, 255, 255, ${opacity1})`;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(100, lineY1);
      ctx.lineTo(width - 100, lineY1);
      ctx.stroke();
      ctx.restore();

      // Bottom line
      const lineY2 = centerY + 150;
      ctx.save();
      const lineGrad2 = ctx.createLinearGradient(100, lineY2, width - 100, lineY2);
      lineGrad2.addColorStop(0, "rgba(255, 0, 255, 0)");
      lineGrad2.addColorStop(0.5, `rgba(255, 0, 255, ${opacity2})`);
      lineGrad2.addColorStop(1, "rgba(255, 0, 255, 0)");
      ctx.strokeStyle = lineGrad2;
      ctx.lineWidth = 2;
      ctx.shadowColor = `rgba(255, 0, 255, ${opacity2})`;
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(100, lineY2);
      ctx.lineTo(width - 100, lineY2);
      ctx.stroke();
      ctx.restore();

      // Corners
      function drawCorner(x, y, opacity, color) {
        ctx.save();
        ctx.strokeStyle = `rgba(${color}, ${opacity * 0.6})`;
        ctx.lineWidth = 2;
        ctx.shadowColor = `rgba(${color}, ${opacity})`;
        ctx.shadowBlur = 10;
        const size = 30;
        ctx.beginPath();
        ctx.moveTo(x - size, y);
        ctx.lineTo(x, y);
        ctx.lineTo(x, y - size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + size, y);
        ctx.lineTo(x, y);
        ctx.lineTo(x, y + size);
        ctx.stroke();
        ctx.restore();
      }

      drawCorner(50, 50, opacity1, "0, 255, 255");
      drawCorner(width - 50, 50, opacity2, "255, 0, 255");
      drawCorner(50, height - 50, opacity2, "255, 0, 255");
      drawCorner(width - 50, height - 50, opacity1, "0, 255, 255");

      const imageData = ctx.getImageData(0, 0, width, height);
      encoder.addFrame(imageData.data);
    }

    encoder.finish();
    stream.pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating neon visual.");
  }
}
