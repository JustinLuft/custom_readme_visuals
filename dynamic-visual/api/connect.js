import { createCanvas, registerFont } from "canvas";
import { GifEncoder } from "@skyra/gifenc";
import path from "path";
import fs from "fs";

// Ensure the font file exists and register it
const fontPath = path.join(process.cwd(), "fonts", "CourierNewBold.ttf");
console.log("Font exists?", fs.existsSync(fontPath), fontPath);
registerFont(fontPath, { family: "CourierNewBold" });

export default async function handler(req, res) {
  try {
    const width = 180;
    const height = 50;
    const text = 'LINKEDIN';
    const color = '#00ffff';
    const colorRGB = '0, 255, 255';

    const encoder = new GifEncoder(width, height);
    const chunks = [];
    const stream = encoder.createReadStream();
    
    stream.on('data', (chunk) => chunks.push(chunk));

    await new Promise((resolve, reject) => {
      stream.on('end', resolve);
      stream.on('error', reject);

      encoder.setDelay(100);
      encoder.setRepeat(0);
      encoder.start();

      for (let frameNum = 0; frameNum < 20; frameNum++) {
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");

        // Background
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, "#0a0a1a");
        bgGrad.addColorStop(1, "#1a0a2e");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Grid
        ctx.strokeStyle = `rgba(${colorRGB}, 0.08)`;
        ctx.lineWidth = 0.5;
        for (let i = 0; i < height; i += 10) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(width, i);
          ctx.stroke();
        }

        // Border
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.strokeRect(2, 2, width - 4, height - 4);
        ctx.restore();

        // Corner cut
        ctx.fillStyle = "#0a0a1a";
        ctx.beginPath();
        ctx.moveTo(width - 12, height - 2);
        ctx.lineTo(width - 2, height - 2);
        ctx.lineTo(width - 2, height - 12);
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width - 12, height - 2);
        ctx.lineTo(width - 2, height - 12);
        ctx.stroke();

        // Pulsing text
        const pulseIntensity = 15 + Math.sin(frameNum / 3) * 10;
        
        ctx.save();
        ctx.font = "bold 16px CourierNewBold"; // <- Use registered font here
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = color;
        ctx.shadowBlur = pulseIntensity;
        ctx.fillStyle = color;
        ctx.fillText(text, width / 2, height / 2);
        ctx.shadowBlur = pulseIntensity + 10;
        ctx.fillText(text, width / 2, height / 2);
        ctx.restore();

        // White overlay
        ctx.save();
        ctx.font = "bold 16px CourierNewBold"; // <- Use registered font here too
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(text, width / 2, height / 2);
        ctx.restore();

        // Scanline
        const scanY = (frameNum / 20) * (height + 4) - 2;
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.fillRect(0, scanY, width, 2);

        const imageData = ctx.getImageData(0, 0, width, height);
        encoder.addFrame(imageData.data);
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
