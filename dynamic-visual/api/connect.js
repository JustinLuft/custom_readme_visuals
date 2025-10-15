import { createCanvas, registerFont } from "canvas";
import { GifEncoder } from "@skyra/gifenc";
import path from "path";

// Register font (adjust path as needed)
try {
  registerFont(
    path.join(process.cwd(), "fonts", "CourierNewBold.ttf"),
    { family: "CourierNewBold" }
  );
} catch (e) {
  console.log("Font registration failed, using default");
}

function generateBadgeFrames(width, height, text, color, colorRGB) {
  const frames = [];
  
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
    ctx.strokeStyle = `rgba(${colorRGB}, 0.08)`;
    ctx.lineWidth = 0.5;
    for (let i = 0; i < height; i += 10) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Main border with glow
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowColor = color;
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
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width - 12, height - 2);
    ctx.lineTo(width - 2, height - 12);
    ctx.stroke();

    // Pulsing glow effect
    const pulseIntensity = 15 + Math.sin(frameNum / 3) * 10;
    
    // Text with glow
    ctx.save();
    ctx.font = "bold 16px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = color;
    ctx.shadowBlur = pulseIntensity;
    ctx.fillStyle = color;
    ctx.fillText(text, width / 2, height / 2);
    ctx.shadowBlur = pulseIntensity + 10;
    ctx.fillText(text, width / 2, height / 2);
    ctx.restore();

    // White text overlay
    ctx.save();
    ctx.font = "bold 16px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(text, width / 2, height / 2);
    ctx.restore();

    // Animated scanline
    const scanY = (frameNum / 20) * (height + 4) - 2;
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    ctx.fillRect(0, scanY, width, 2);

    const imageData = ctx.getImageData(0, 0, width, height);
    frames.push(imageData.data);
  }
  
  return frames;
}

export default async function handler(req, res) {
  try {
    const { badge } = req.query;
    
    const width = 180;
    const height = 50;

    let text, color, colorRGB;
    
    if (badge === 'linkedin') {
      text = 'LINKEDIN';
      color = '#00ffff';
      colorRGB = '0, 255, 255';
    } else if (badge === 'website') {
      text = 'WEBSITE';
      color = '#ff00ff';
      colorRGB = '255, 0, 255';
    } else {
      return res.status(400).send("Invalid badge type. Use ?badge=linkedin or ?badge=website");
    }

    // Generate all frames
    const frames = generateBadgeFrames(width, height, text, color, colorRGB);

    // Create encoder
    const encoder = new GifEncoder(width, height);
    
    // Collect chunks
    const chunks = [];
    const stream = encoder.createReadStream();
    
    stream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    // Wait for stream to finish
    await new Promise((resolve, reject) => {
      stream.on('end', resolve);
      stream.on('error', reject);

      // Start encoding
      encoder.setDelay(100);
      encoder.setRepeat(0);
      encoder.start();

      // Add all frames
      frames.forEach(frameData => {
        encoder.addFrame(frameData);
      });

      encoder.finish();
    });

    // Combine chunks and send
    const buffer = Buffer.concat(chunks);
    
    res.setHeader("Content-Type", "image/gif");
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400, stale-while-revalidate");
    res.send(buffer);

  } catch (err) {
    console.error("Badge generation error:", err);
    res.status(500).json({ 
      error: "Error generating badge",
      message: err.message 
    });
  }
}
