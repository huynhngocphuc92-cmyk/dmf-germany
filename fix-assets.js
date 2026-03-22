#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports, no-console */

/**
 * Download placeholder images and a temporary logo
 * so the deployment does not ship broken asset URLs.
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

// ============================================
// CONFIGURATION
// ============================================

const PUBLIC_DIR = path.join(__dirname, "public");
const IMAGES_DIR = path.join(PUBLIC_DIR, "images");

// Unsplash source images used for temporary placeholders.
const IMAGE_URLS = {
  "nursing.jpg":
    "https://images.unsplash.com/photo-1559757148-5c3507c8c35d?w=1200&h=800&fit=crop&q=80",
  "tech.jpg":
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=800&fit=crop&q=80",
  "hotel.jpg":
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=800&fit=crop&q=80",
  "construction.jpg":
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop&q=80",
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Create a directory if it does not exist yet.
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ Created directory: ${dirPath}`);
  }
}

/**
 * Download a file from a URL into the destination path.
 */
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);

    https
      .get(url, (response) => {
        // Follow redirects.
        if (response.statusCode === 301 || response.statusCode === 302) {
          return downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
        }

        if (response.statusCode !== 200) {
          file.close();
          fs.unlinkSync(destPath);
          reject(new Error(`HTTP ${response.statusCode}: ${url}`));
          return;
        }

        response.pipe(file);

        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        file.close();
        fs.unlinkSync(destPath);
        reject(err);
      });
  });
}

/**
 * Generate a temporary SVG logo and try to fetch a PNG companion.
 */
async function createTemporaryLogo(destPath) {
  // Create a minimal DMF SVG logo.
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="60" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="200" height="60" fill="url(#grad)" rx="8"/>
  <text x="100" y="42" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle" letter-spacing="2">DMF</text>
</svg>`;

  // Save the SVG fallback.
  const svgPath = destPath.replace(".png", ".svg");
  fs.writeFileSync(svgPath, svgContent);
  console.log(`✓ Created temporary SVG logo: ${svgPath}`);

  // Try to download a temporary PNG placeholder.
  const placeholderPngUrl = "https://via.placeholder.com/200x60/1e40af/ffffff.png?text=DMF";

  try {
    await downloadFile(placeholderPngUrl, destPath);
    console.log(`✓ Created temporary PNG logo: ${destPath}`);
  } catch (err) {
    console.warn(`⚠ Unable to download the PNG placeholder. SVG fallback is ready: ${err.message}`);
    console.log("   → Use logo.svg for now or replace logo.png with the final brand asset.");
  }
}

/**
 * Download all required placeholder assets.
 */
async function downloadAllImages() {
  console.log("\n📥 Downloading placeholder assets...\n");

  // Ensure the target directories exist.
  ensureDirectoryExists(PUBLIC_DIR);
  ensureDirectoryExists(IMAGES_DIR);

  // Download service placeholder images.
  for (const [filename, url] of Object.entries(IMAGE_URLS)) {
    const destPath = path.join(IMAGES_DIR, filename);

    // Skip files that are already present.
    if (fs.existsSync(destPath)) {
      console.log(`⏭  Skipping existing file: ${filename}`);
      continue;
    }

    try {
      console.log(`⬇  Downloading: ${filename}...`);
      await downloadFile(url, destPath);
      console.log(`✓  Downloaded successfully: ${filename}\n`);
    } catch (error) {
      console.error(`✗  Failed to download ${filename}: ${error.message}\n`);
    }
  }

  // Create a temporary logo when none exists yet.
  const logoPath = path.join(PUBLIC_DIR, "logo.png");
  if (!fs.existsSync(logoPath)) {
    console.log("⬇  Creating temporary logo...");
    try {
      await createTemporaryLogo(logoPath);
    } catch (error) {
      console.error(`✗  Failed to create logo: ${error.message}`);
    }
  } else {
    console.log("⏭  Existing logo found, skipping: logo.png");
  }
}

/**
 * Main function
 */
async function main() {
  console.log("🚀 Asset repair script - download placeholder images and a temporary logo\n");
  console.log("=".repeat(60));

  try {
    await downloadAllImages();

    console.log("=".repeat(60));
    console.log("\n✅ Done. All placeholder assets have been prepared.\n");
    console.log("📋 Summary:");
    console.log("   - Temporary logo: public/logo.png");
    console.log("   - Service images: public/images/");
    console.log("     • nursing.jpg");
    console.log("     • tech.jpg");
    console.log("     • hotel.jpg");
    console.log("     • construction.jpg\n");
    console.log("⚠️  Important:");
    console.log("   - The current logo is only a placeholder (.png plus .svg fallback).");
    console.log("   - Replace public/logo.png with the official brand asset.");
    console.log("   - Service images can also be replaced with real campaign assets later.");
    console.log("   - All placeholder images were fetched from Unsplash.\n");
  } catch (error) {
    console.error("\n❌ Script failed:", error.message);
    process.exit(1);
  }
}

// Run the script when executed directly.
if (require.main === module) {
  main();
}

module.exports = { downloadAllImages, createTemporaryLogo };
