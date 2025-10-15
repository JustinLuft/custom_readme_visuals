import { createCanvas } from "canvas";
import { GifEncoder } from "@skyra/gifenc";

export default async function handler(req, res) {
  try {
    const width = 180;
    const height = 10; // thin line
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

      const frames = 20;

      for (let frame = 0; frame < frames; frame++) {
        const canvas = createCanvas(scaledWidth, scaledHeight);
        const ctx = canvas.getContext("2d");

        // Transparent background
        ctx.clearRect(0, 0, scaledWidth, scaledHeight);

        // Draw solid blue line
        ctx.strokeStyle = "rgba(0, 255, 255, 1)";
        ctx.lineWidth = 4 * scale;
        ctx.beginPath();
        ctx.moveTo(0, scaledHeight / 2);
        ctx.lineTo(scaledWidth, scaledHeight / 2);
        ctx.stroke();

        // Pink sweeping aura
        const sweepWidth = scaledWidth / 4; // width of pink aura
        const sweepPosition = (frame / frames) * (scaledWidth + sweepWidth) - sweepWidth;

        const gradient = ctx.createLinearGradient(sweepPosition, 0, sweepPosition + sweepWidth, 0);
        gradient.addColorStop(0, "rgba(255, 0, 255, 0)");
        gradient.addColorStop(0.3, "rgba(255, 0, 255, 0.6)");
        gradient.addColorStop(0.5, "rgba(255, 0, 255, 1)");
        gradient.addColorStop(0.7, "rgba(255, 0, 255, 0.6)");
        gradient.addColorStop(1, "rgba(255, 0, 255, 0)");

        ctx.strokeStyle = gradient;
        ctx.shadowColor = "rgba(255, 0, 255, 0.5)";
        ctx.shadowBlur = 8 * scale;

        ctx.beginPath();
        ctx.moveTo(0, scaledHeight / 2);
        ctx.lineTo(scaledWidth, scaledHeight / 2);
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
