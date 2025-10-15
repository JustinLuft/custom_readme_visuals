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

async function generateCyberpunkButton(text, link, filename) {
  const width = 250;
  const height = 60;

  const encoder = new GifEncoder(width, height);
  const stream = encoder.createReadStream();

  encoder.setDelay(200); // Faster glitch
  encoder.setRepeat(0);
  encoder.start();

  for (let frameNum = 0; frameNum < 5; frameNum++) { // More frames for glitch
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);

    // Text
    ctx.font = 'bold 20px CourierNewBold';
    ctx.fillStyle = '#00ff00';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // "Glitched" Text
    const glitchOffset = (Math.random() - 0.5) * 10; // Random offset
    ctx.save();
    ctx.translate(glitchOffset, glitchOffset);
    ctx.fillText(text, width / 2, height / 2);
    ctx.restore();

    const imageData = ctx.getImageData(0, 0, width, height);
    encoder.addFrame(imageData.data);
  }

  encoder.finish();

  // Save the GIF
  stream.pipe(fs.createWriteStream(filename));

  console.log(`Generated ${filename}`);
}

async function main() {
  // Generate buttons
  await generateCyberpunkButton("LinkedIn", "http://www.linkedin.com/in/justinnl", "linkedin-button.gif");
  await generateCyberpunkButton("Website", "https://portfolio-web-mu-ten.vercel.app/", "website-button.gif");

  console.log("All buttons generated!");
}

main();
