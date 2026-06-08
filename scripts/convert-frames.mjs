import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const sourceDir = path.join(root, "images");
const outputDir = path.join(root, "public", "frames");
const quality = 84;

await fs.mkdir(outputDir, { recursive: true });

const entries = await fs.readdir(sourceDir);
const frames = entries
  .filter((name) => /\.(png|jpe?g|webp)$/i.test(name))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

if (frames.length === 0) {
  throw new Error(`No source frames found in ${sourceDir}`);
}

let index = 0;
for (const frame of frames) {
  index += 1;
  const input = path.join(sourceDir, frame);
  const output = path.join(outputDir, `frame-${String(index).padStart(4, "0")}.webp`);

  await sharp(input)
    .webp({ quality, effort: 6, smartSubsample: true })
    .toFile(output);
}

console.log(`Converted ${frames.length} frames to ${outputDir}`);
console.log("FFmpeg equivalent from an MP4:");
console.log("ffmpeg -i animation.mp4 -vf fps=30,scale=1640:1264 public/frames/frame-%04d.webp");
