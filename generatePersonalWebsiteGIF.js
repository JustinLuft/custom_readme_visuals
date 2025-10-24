import { createCanvas, registerFont } from "canvas";
import { GifEncoder } from "@skyra/gifenc";
import fs from "fs";
import path from "path";

// ----------------------
// FONT SETUP
// ----------------------
const fontPath = path.join(process.cwd(), "dynamic-visual", "fonts", "CourierNewBold.ttf");
if (!fs.existsSync(fontPath)) {
  console.error("Font not found at", fontPath);
  process.exit(1);
}
registerFont(fontPath, { family: "CourierNewBold" });

// ----------------------
// CANVAS & GIF SETUP
// ----------------------
const baseWidth = 220;
const baseHeight = 50;
const scale = 2; // Adjust scale if needed
const width = baseWidth * scale;
const height = baseHeight * scale;

const text = "PERSONAL WEBSITE";
const color = "#ff00ff";
const colorRGB = "255,0,255";

const encoder = new GifEncoder(width, height);
const chunks = [];
const stream = encoder.createReadStream();
stream.on("data", (chunk) => chunks.push(chunk));

stream.on("end", () => {
  const outPath = path.join(process.cwd(), "dynamic-visual", "public", "personalwebsite.gif");
  fs.writeFileSync(outPath, Buffer.concat(chunks));
  console.log("GIF generated at", outPath);
});

encoder.setDelay(100);
encoder.setRepeat(0);
encoder.start();

const totalFrames = 20; // Adjust frames if needed

for (let frameNum = 0; frameNum < totalFrames; frameNum++) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // ------------------
  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, "#0a0a1a");
  bgGrad.addColorStop(1, "#1a0a2e");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // ------------------
  // Grid (optional)
  ctx.strokeStyle = `rgba(${colorRGB},0.08)`;
  ctx.lineWidth = 0.5 * scale;
  for (let i = 0; i < height; i += 10 * scale) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(width, i);
    ctx.stroke();
  }

  // ------------------
  // Border glow
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2 * scale;
  ctx.shadowColor = color;
  ctx.shadowBlur = 5 * scale;
  ctx.strokeRect(2 * scale, 2 * scale, width - 4 * scale, height - 4 * scale);
  ctx.restore();

  // ------------------
  // Bottom-right corner cut + stroke (old design)
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

  // ------------------
  // Pulsing text
  const pulseIntensity = 10 + Math.sin(frameNum / 3) * 5;
  ctx.save();
  ctx.font = `${16 * scale}px CourierNewBold`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = pulseIntensity * scale;
  ctx.fillText(text, width / 2, height / 2);
  ctx.restore();

  // ------------------
  // White overlay
  ctx.save();
  ctx.font = `${16 * scale}px CourierNewBold`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(text, width / 2, height / 2);
  ctx.restore();

  // ------------------
  // Scanline effect
  const scanY = (frameNum / totalFrames) * (height + 4 * scale) - 2 * scale;
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.fillRect(0, scanY, width, 2 * scale);

  // ------------------
  // Add frame to encoder
  encoder.addFrame(ctx);
}

encoder.finish();
