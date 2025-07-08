const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const inputDir = 'img';
const outputDir = 'img/optimized';
const qualities = {
  webp: 80,
  jpeg: 85,
  png: 90
};

const sizes = [400, 800, 1200, 1600]; // Different sizes for responsive images

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function optimizeImage(inputPath, outputDir, filename) {
  const name = path.parse(filename).name;
  const ext = path.parse(filename).ext.toLowerCase();
  
  // Skip if already optimized
  if (inputPath.includes('/optimized/')) return;
  
  console.log(`Optimizing: ${inputPath}`);
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Only optimize if image is larger than 100KB
    const stats = fs.statSync(inputPath);
    if (stats.size < 100 * 1024) {
      console.log(`Skipping ${filename} - too small`);
      return;
    }
    
    // Create different sizes for responsive images
    for (const size of sizes) {
      // Skip if original is smaller than target size
      if (metadata.width <= size) continue;
      
      const outputName = `${name}-${size}w`;
      
      // Create WebP version (best compression)
      await image
        .resize(size, null, { withoutEnlargement: true })
        .webp({ quality: qualities.webp })
        .toFile(path.join(outputDir, `${outputName}.webp`));
      
      // Create optimized JPEG fallback
      if (ext === '.jpg' || ext === '.jpeg') {
        await image
          .resize(size, null, { withoutEnlargement: true })
          .jpeg({ quality: qualities.jpeg, progressive: true })
          .toFile(path.join(outputDir, `${outputName}.jpg`));
      }
    }
    
    // Create full-size optimized versions
    await image
      .webp({ quality: qualities.webp })
      .toFile(path.join(outputDir, `${name}.webp`));
    
    if (ext === '.jpg' || ext === '.jpeg') {
      await image
        .jpeg({ quality: qualities.jpeg, progressive: true })
        .toFile(path.join(outputDir, `${name}.jpg`));
    } else if (ext === '.png') {
      await image
        .png({ quality: qualities.png, progressive: true })
        .toFile(path.join(outputDir, `${name}.png`));
    }
    
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error.message);
  }
}

async function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory() && entry.name !== 'optimized') {
      await processDirectory(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        const relativePath = path.relative(inputDir, dir);
        const outputPath = path.join(outputDir, relativePath);
        await ensureDir(outputPath);
        await optimizeImage(fullPath, outputPath, entry.name);
      }
    }
  }
}

async function main() {
  console.log('Starting image optimization...');
  await ensureDir(outputDir);
  await processDirectory(inputDir);
  console.log('Image optimization complete!');
}

main().catch(console.error);