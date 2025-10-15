import { createCanvas } from "canvas";
import { GifEncoder } from "@skyra/gifenc";

export default async function handler(req, res) {
  try {
    const width = 180;
    const height = 50;
    const scale = 4;
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;

    const encoder = new GifEncoder(scaledWidth, scaledHeight);
    const chunks = [];
    const stream = encoder.createReadStream();

    stream.on("data", (chunk) => chunks.push(chunk));

    await new Promise((resolve, reject) => {
      stream.on("end", resolve);
      stream.on("error", reject);

      encoder.setDelay(100);
      encoder.setRepeat(0);
      encoder.start();

      for (let frame = 0; frame < 20; frame++) {
        const canvas = createCanvas(scaledWidth, scaledHeight);
        const ctx = canvas.getContext("2d");

        // Background gradient
        const bgGrad = ctx.createLinearGradient(0, 0, scaledWidth, scaledHeight);
        bgGrad.addColorStop(0, "#0a0a1a");
        bgGrad.addColorStop(1, "#00102e");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, scaledWidth, scaledHeight);

        // Pulsing blue line
        const pulse = 0.6 + 0.4 * Math.sin(frame / 3); // opacity 0.2-1
        ctx.strokeStyle = `rgba(0, 255, 255, ${pulse})`;
        ctx.lineWidth = 4 * scale;
        ctx.shadowColor = "rgba(0, 255, 255, 0.6)";
        ctx.shadowBlur = 10 * scale;
        ctx.beginPath();
        ctx.moveTo(10 * scale, scaledHeight / 2);
        ctx.lineTo(scaledWidth - 10 * scale, scaledHeight / 2);
        ctx.stroke();

        encoder.addFrame(ctx);
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
