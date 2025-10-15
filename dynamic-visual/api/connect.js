import { createCanvas, registerFont } from "canvas";
import { GifEncoder } from "@skyra/gifenc";
import path from "path";

// Register font (adjust path as needed)
registerFont(
  path.join(process.cwd(), "fonts", "CourierNewBold.ttf"),
  { family: "CourierNewBold" }
);

export async function generateLinkedInBadge(req, res) {
  try {
    const width = 180;
    const height = 50;

    const encoder = new GifEncoder(width, height);
    const stream = encoder.createReadStream();

    res.setHeader("Content-Type", "image/gif");
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");

    encoder.setDelay(100);
    encoder.setRepeat(0);
    encoder.start();

    // Generate 20 frames for smooth scanline animation
    for (let frameNum = 0; frameNum < 20; frameNum++) {
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, "#0a0a1a");
      bgGrad.addColorStop(1, "#1a0a2e");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Grid pattern
      ctx.strokeStyle = "rgba(0, 255, 255, 0.08)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < height; i += 10) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // Main border with glow
      ctx.save();
      ctx.strokeStyle = "#00ffff";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#00ffff";
      ctx.shadowBlur = 10;
      ctx.strokeRect(2, 2, width - 4, height - 4);
      ctx.restore();

      // Corner cut (bottom right)
      ctx.fillStyle = "#0a0a1a";
      ctx.beginPath();
      ctx.moveTo(width - 12, height - 2);
      ctx.lineTo(width - 2, height - 2);
      ctx.lineTo(width - 2, height - 12);
      ctx.closePath();
      ctx.fill();
      
      ctx.strokeStyle = "#00ffff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width - 12, height - 2);
      ctx.lineTo(width - 2, height - 12);
      ctx.stroke();

      // Pulsing glow effect
      const pulseIntensity = 15 + Math.sin(frameNum / 3) * 10;
      
      // Text with glow
      ctx.save();
      ctx.font = "bold 16px CourierNewBold";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "#00ffff";
      ctx.shadowBlur = pulseIntensity;
      ctx.fillStyle = "#00ffff";
      ctx.fillText("LINKEDIN", width / 2, height / 2);
      ctx.shadowBlur = pulseIntensity + 10;
      ctx.fillText("LINKEDIN", width / 2, height / 2);
      ctx.restore();

      // White text overlay
      ctx.save();
      ctx.font = "bold 16px CourierNewBold";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("LINKEDIN", width / 2, height / 2);
      ctx.restore();

      // Animated scanline
      const scanY = (frameNum / 20) * (height + 4) - 2;
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.fillRect(0, scanY, width, 2);

      const imageData = ctx.getImageData(0, 0, width, height);
      encoder.addFrame(imageData.data);
    }

    encoder.finish();
    stream.pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating LinkedIn badge.");
  }
}

export async function generateWebsiteBadge(req, res) {
  try {
    const width = 180;
    const height = 50;

    const encoder = new GifEncoder(width, height);
    const stream = encoder.createReadStream();

    res.setHeader("Content-Type", "image/gif");
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");

    encoder.setDelay(100);
    encoder.setRepeat(0);
    encoder.start();

    // Generate 20 frames for smooth scanline animation
    for (let frameNum = 0; frameNum < 20; frameNum++) {
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, "#0a0a1a");
      bgGrad.addColorStop(1, "#1a0a2e");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Grid pattern
      ctx.strokeStyle = "rgba(255, 0, 255, 0.08)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < height; i += 10) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // Main border with glow
      ctx.save();
      ctx.strokeStyle = "#ff00ff";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#ff00ff";
      ctx.shadowBlur = 10;
      ctx.strokeRect(2, 2, width - 4, height - 4);
      ctx.restore();

      // Corner cut (bottom right)
      ctx.fillStyle = "#0a0a1a";
      ctx.beginPath();
      ctx.moveTo(width - 12, height - 2);
      ctx.lineTo(width - 2, height - 2);
      ctx.lineTo(width - 2, height - 12);
      ctx.closePath();
      ctx.fill();
      
      ctx.strokeStyle = "#ff00ff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width - 12, height - 2);
      ctx.lineTo(width - 2, height - 12);
      ctx.stroke();

      // Pulsing glow effect (offset from LinkedIn)
      const pulseIntensity = 15 + Math.sin((frameNum + 10) / 3) * 10;
      
      // Text with glow
      ctx.save();
      ctx.font = "bold 16px CourierNewBold";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "#ff00ff";
      ctx.shadowBlur = pulseIntensity;
      ctx.fillStyle = "#ff00ff";
      ctx.fillText("WEBSITE", width / 2, height / 2);
      ctx.shadowBlur = pulseIntensity + 10;
      ctx.fillText("WEBSITE", width / 2, height / 2);
      ctx.restore();

      // White text overlay
      ctx.save();
      ctx.font = "bold 16px CourierNewBold";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("WEBSITE", width / 2, height / 2);
      ctx.restore();

      // Animated scanline (offset from LinkedIn)
      const scanY = ((frameNum + 10) / 20) * (height + 4) - 2;
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.fillRect(0, scanY % (height + 4), width, 2);

      const imageData = ctx.getImageData(0, 0, width, height);
      encoder.addFrame(imageData.data);
    }

    encoder.finish();
    stream.pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating website badge.");
  }
}

// If using Express/Next.js API routes:
export default async function handler(req, res) {
  const { badge } = req.query;
  
  if (badge === 'linkedin') {
    return generateLinkedInBadge(req, res);
  } else if (badge === 'website') {
    return generateWebsiteBadge(req, res);
  } else {
    res.status(400).send("Invalid badge type");
  }
}
