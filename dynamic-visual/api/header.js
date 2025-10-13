import { createCanvas } from "canvas";
import { GifEncoder } from "@skyra/gifenc";
import 'dotenv/config';

export default async function handler(req, res) {
  try {
    // ⚠️ Check for GITHUB_TOKEN
    if (!process.env.GITHUB_TOKEN) {
      console.warn("⚠️ GITHUB_TOKEN is NOT set in this serverless function!");
    } else {
      console.log("✅ GITHUB_TOKEN loaded successfully.");
    }

    const width = 1000;
    const height = 450;

    // Initialize GIF encoder
    const encoder = new GifEncoder(width, height);
    const stream = encoder.createReadStream();
    
    // Set up response
    res.setHeader("Content-Type", "image/gif");
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
    
    // Start encoding
    encoder.setDelay(500); // 500ms between frames
    encoder.setRepeat(0); // Loop forever
    encoder.start();

    // Generate 2 frames for flashing effect
    for (let frameNum = 0; frameNum < 2; frameNum++) {
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");
      
      const cycle = frameNum;
      
      const opacity1 = cycle === 0 ? 1 : 0.3;
      const opacity2 = cycle === 1 ? 1 : 0.3;
      const glowIntensity1 = cycle === 0 ? 40 : 10;
      const glowIntensity2 = cycle === 1 ? 40 : 10;

      // Enhanced Background
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

      // "JUSTIN" - Cyan/Blue neon
      ctx.save();
      ctx.font = "bold 120px 'Courier New'";
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

      // "LUFT" - Magenta/Pink neon
      ctx.save();
      ctx.font = "bold 120px 'Courier New'";
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

      // Decorative lines and corners
      // ... (same as before)

      const imageData = ctx.getImageData(0, 0, width, height);
      encoder.addFrame(imageData.data);
    }

    encoder.finish();
    
    // Pipe to response
    stream.pipe(res);
    
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating neon visual.");
  }
}
