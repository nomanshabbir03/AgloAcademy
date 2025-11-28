const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);

const INPUT_DIR = path.join(__dirname, '../public/images');
const OUTPUT_DIR = path.join(__dirname, '../public/optimized-images');
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

async function optimizeImage(inputPath, outputPath) {
  try {
    const outputDir = path.dirname(outputPath);
    await mkdir(outputDir, { recursive: true });

    await sharp(inputPath)
      .resize({
        width: 1920,
        height: 1080,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality: 80,
        effort: 6,
      })
      .toFile(outputPath.replace(/\.(jpg|jpeg|png)$/, '.webp'));

    console.log(`Optimized: ${inputPath} -> ${outputPath.replace(/\.(jpg|jpeg|png)$/, '.webp')}`);
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error);
  }
}

async function processDirectory(directory) {
  try {
    const files = await readdir(directory);
    
    for (const file of files) {
      const fullPath = path.join(directory, file);
      const relativePath = path.relative(INPUT_DIR, fullPath);
      const outputPath = path.join(OUTPUT_DIR, relativePath);
      const fileStat = await stat(fullPath);

      if (fileStat.isDirectory()) {
        await processDirectory(fullPath);
      } else if (ALLOWED_EXTENSIONS.includes(path.extname(file).toLowerCase())) {
        await optimizeImage(fullPath, outputPath);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${directory}:`, error);
  }
}

async function main() {
  try {
    console.log('Starting image optimization...');
    await processDirectory(INPUT_DIR);
    console.log('Image optimization completed!');
  } catch (error) {
    console.error('Error during image optimization:', error);
    process.exit(1);
  }
}

main();
