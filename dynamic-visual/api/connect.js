import { createCanvas } from "canvas";
import 'dotenv/config';

export default async function handler(req, res) {
  try {
    // Canvas setup
    const width = 800;
    const height = 200;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Enhanced Background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#0a0a1a");
    gradient.addColorStop(0.3, "#1a0a2e");
    gradient.addColorStop(0.7, "#16213e");
    gradient.addColorStop(1, "#0f0f1e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Grid background
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

    // Draw Website Button (Left - Cyan)
    const button1X = 100;
    const button1Y = 100;
    const buttonWidth = 280;
    const buttonHeight = 70;

    // Button background with glow
    ctx.save();
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur = 20;
    ctx.strokeRect(button1X, button1Y - buttonHeight/2, buttonWidth, buttonHeight);
    
    // Inner glow
    ctx.fillStyle = "rgba(0, 255, 255, 0.05)";
    ctx.fillRect(button1X, button1Y - buttonHeight/2, buttonWidth, buttonHeight);
    ctx.restore();

    // Corner decorations for button 1
    const cornerSize = 15;
    ctx.save();
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur = 10;
    
    // Top-left corner
    ctx.beginPath();
    ctx.moveTo(button1X - 8, button1Y - buttonHeight/2 - 8 + cornerSize);
    ctx.lineTo(button1X - 8, button1Y - buttonHeight/2 - 8);
    ctx.lineTo(button1X - 8 + cornerSize, button1Y - buttonHeight/2 - 8);
    ctx.stroke();
    
    // Bottom-right corner
    ctx.beginPath();
    ctx.moveTo(button1X + buttonWidth + 8 - cornerSize, button1Y + buttonHeight/2 + 8);
    ctx.lineTo(button1X + buttonWidth + 8, button1Y + buttonHeight/2 + 8);
    ctx.lineTo(button1X + buttonWidth + 8, button1Y + buttonHeight/2 + 8 - cornerSize);
    ctx.stroke();
    ctx.restore();

    // Website button text
    ctx.save();
    ctx.font = "bold 24px 'Courier New'";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur = 15;
    ctx.fillText("🌐 VISIT WEBSITE", button1X + buttonWidth/2, button1Y);
    ctx.restore();

    // Draw LinkedIn Button (Right - Magenta)
    const button2X = 480;
    const button2Y = 100;

    // Button background with glow
    ctx.save();
    ctx.strokeStyle = "#ff00ff";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#ff00ff";
    ctx.shadowBlur = 20;
    ctx.strokeRect(button2X, button2Y - buttonHeight/2, buttonWidth, buttonHeight);
    
    // Inner glow
    ctx.fillStyle = "rgba(255, 0, 255, 0.05)";
    ctx.fillRect(button2X, button2Y - buttonHeight/2, buttonWidth, buttonHeight);
    ctx.restore();

    // Corner decorations for button 2
    ctx.save();
    ctx.strokeStyle = "#ff00ff";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#ff00ff";
    ctx.shadowBlur = 10;
    
    // Top-left corner
    ctx.beginPath();
    ctx.moveTo(button2X - 8, button2Y - buttonHeight/2 - 8 + cornerSize);
    ctx.lineTo(button2X - 8, button2Y - buttonHeight/2 - 8);
    ctx.lineTo(button2X - 8 + cornerSize, button2Y - buttonHeight/2 - 8);
    ctx.stroke();
    
    // Bottom-right corner
    ctx.beginPath();
    ctx.moveTo(button2X + buttonWidth + 8 - cornerSize, button2Y + buttonHeight/2 + 8);
    ctx.lineTo(button2X + buttonWidth + 8, button2Y + buttonHeight/2 + 8);
    ctx.lineTo(button2X + buttonWidth + 8, button2Y + buttonHeight/2 + 8 - cornerSize);
    ctx.stroke();
    ctx.restore();

    // LinkedIn button text
    ctx.save();
    ctx.font = "bold 24px 'Courier New'";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "#ff00ff";
    ctx.shadowBlur = 15;
    ctx.fillText("💼 LINKEDIN", button2X + buttonWidth/2, button2Y);
    ctx.restore();

    // Output image
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
    canvas.pngStream().pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating connect buttons.");
  }
}