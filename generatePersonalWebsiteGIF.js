import { createCanvas, registerFont } from "canvas";
import { GifEncoder } from "@skyra/gifenc";
import fs from "fs";
import path from "path";

// Register the font
const fontPath = path.join(process.cwd(), "dynamic-visual", "fonts", "CourierNewBold.ttf");
registerFont(fontPath, { family: "CourierNewBold" });

// Canvas size
const baseWidth = 220;
const baseHeight = 50;
const scale = 2;
const width = baseWidth * scale;
const height = baseHeight * scale;

const text = "PERSONAL WEBSITE";
const color = "#ff00ff";

const encoder = new GifEncoder(width, height);
const chunks = [];
const stream = encoder.createReadStream();
stream.on("data", (chunk) => chunks.push(chunk));

stream.on("end", () => {
  const buffer = Buffer.concat(chunks);
  fs.writeFileSync(path.join(process.cwd(), "public", "personalwebsite.gif"), buffer);
  console.log("GIF generated at /public/personalwebsite.gif");
});

encoder.setDelay(100);
encoder.setRepeat(0);
encoder.start();

const totalFrames = 10; // smaller frames = faster
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

  // Pulsing text
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
