import sharp from "sharp";
import path from "path";
import fs from "fs";

const SRC = path.resolve("public/icons/icon-512.png");
const BG_COLOR = { r: 11, g: 11, b: 15, alpha: 1 };

async function generateMaskable() {
  const SIZE = 512;
  const SAFE_RATIO = 0.8;
  const contentSize = Math.round(SIZE * SAFE_RATIO);

  const resized = await sharp(SRC).resize(contentSize, contentSize).toBuffer();

  await sharp({
    create: { width: SIZE, height: SIZE, channels: 4, background: BG_COLOR },
  })
    .composite([{ input: resized, gravity: "center" }])
    .png()
    .toFile(path.resolve("public/icons/icon-512-maskable.png"));

  console.log("✓ public/icons/icon-512-maskable.png created");
}

async function resizeScreenshotIfNeeded(fileName) {
  const filePath = path.resolve("public/screenshots", fileName);

  if (!fs.existsSync(filePath)) {
    console.log(`✗ ${fileName} not found, skipping`);
    return;
  }

  const meta = await sharp(filePath).metadata();
  console.log(`  ${fileName} current size: ${meta.width}x${meta.height}`);

  const MAX = 3840;
  const scale = Math.min(1, MAX / Math.max(meta.width, meta.height));

  if (scale >= 1) {
    console.log(`✓ ${fileName} already within limits, no resize needed`);
    return;
  }

  const newWidth = Math.round(meta.width * scale);
  const newHeight = Math.round(meta.height * scale);
  const tempPath = filePath + ".tmp.png";

  await sharp(filePath).resize(newWidth, newHeight).toFile(tempPath);
  fs.rmSync(filePath);
  fs.renameSync(tempPath, filePath);

  console.log(`✓ ${fileName} resized to ${newWidth}x${newHeight}`);
}

async function main() {
  await generateMaskable();
  await resizeScreenshotIfNeeded("wide.png");
  await resizeScreenshotIfNeeded("narrow.png");
}

await main();