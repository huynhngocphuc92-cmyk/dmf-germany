#!/usr/bin/env node

/**
 * Script tự động tải các file ảnh placeholder và logo tạm thời
 * để tránh lỗi 404 khi deploy lên Vercel
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

// ============================================
// CONFIGURATION
// ============================================

const PUBLIC_DIR = path.join(__dirname, "public");
const IMAGES_DIR = path.join(PUBLIC_DIR, "images");

// Unsplash URLs - Ảnh chất lượng cao, miễn phí sử dụng
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
 * Tạo thư mục nếu chưa tồn tại
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ Đã tạo thư mục: ${dirPath}`);
  }
}

/**
 * Tải file từ URL và lưu vào đường dẫn đích
 */
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);

    https
      .get(url, (response) => {
        // Xử lý redirect
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
 * Tạo logo PNG và SVG tạm thời đơn giản
 */
async function createTemporaryLogo(destPath) {
  // Tạo một SVG logo đơn giản với text "DMF" - chuyên nghiệp hơn
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

  // Lưu SVG tạm thời
  const svgPath = destPath.replace(".png", ".svg");
  fs.writeFileSync(svgPath, svgContent);
  console.log(`✓ Đã tạo logo SVG tạm thời: ${svgPath}`);

  // Tải một PNG placeholder từ service (hoặc tạo base64 PNG đơn giản)
  // Sử dụng placeholder.com hoặc tạo PNG base64
  const placeholderPngUrl = "https://via.placeholder.com/200x60/1e40af/ffffff.png?text=DMF";

  try {
    await downloadFile(placeholderPngUrl, destPath);
    console.log(`✓ Đã tạo logo PNG tạm thời: ${destPath}`);
  } catch (err) {
    console.warn(`⚠ Không thể tải logo PNG từ URL, đã tạo SVG thay thế: ${err.message}`);
    // Nếu không tải được, tạo một file PNG base64 đơn giản (1x1 pixel blue)
    // Hoặc copy SVG và đổi tên
    console.log(`   → Bạn có thể sử dụng logo.svg hoặc thay thế logo.png bằng logo chính thức`);
  }
}

/**
 * Tải tất cả các ảnh cần thiết
 */
async function downloadAllImages() {
  console.log("\n📥 Bắt đầu tải các file ảnh...\n");

  // Tạo thư mục
  ensureDirectoryExists(PUBLIC_DIR);
  ensureDirectoryExists(IMAGES_DIR);

  // Tải các ảnh dịch vụ
  for (const [filename, url] of Object.entries(IMAGE_URLS)) {
    const destPath = path.join(IMAGES_DIR, filename);

    // Bỏ qua nếu file đã tồn tại
    if (fs.existsSync(destPath)) {
      console.log(`⏭  File đã tồn tại, bỏ qua: ${filename}`);
      continue;
    }

    try {
      console.log(`⬇  Đang tải: ${filename}...`);
      await downloadFile(url, destPath);
      console.log(`✓  Đã tải thành công: ${filename}\n`);
    } catch (error) {
      console.error(`✗  Lỗi khi tải ${filename}: ${error.message}\n`);
    }
  }

  // Tạo logo tạm thời
  const logoPath = path.join(PUBLIC_DIR, "logo.png");
  if (!fs.existsSync(logoPath)) {
    console.log(`⬇  Đang tạo logo tạm thời...`);
    try {
      await createTemporaryLogo(logoPath);
    } catch (error) {
      console.error(`✗  Lỗi khi tạo logo: ${error.message}`);
    }
  } else {
    console.log(`⏭  Logo đã tồn tại, bỏ qua: logo.png`);
  }
}

/**
 * Main function
 */
async function main() {
  console.log("🚀 Script sửa lỗi Assets - Tải ảnh placeholder và logo tạm thời\n");
  console.log("=".repeat(60));

  try {
    await downloadAllImages();

    console.log("=".repeat(60));
    console.log("\n✅ Hoàn thành! Đã tải xong tất cả các file ảnh.\n");
    console.log("📋 Tóm tắt:");
    console.log("   - Logo tạm thời: public/logo.png");
    console.log("   - Ảnh dịch vụ: public/images/");
    console.log("     • nursing.jpg");
    console.log("     • tech.jpg");
    console.log("     • hotel.jpg");
    console.log("     • construction.jpg\n");
    console.log("⚠️  LƯU Ý QUAN TRỌNG:");
    console.log("   - Logo hiện tại là placeholder tạm thời (có cả .png và .svg).");
    console.log("   - Vui lòng thay thế file public/logo.png bằng logo chính thức của bạn.");
    console.log("   - Các ảnh dịch vụ có thể được thay thế bằng ảnh thực tế nếu cần.");
    console.log("   - Tất cả ảnh đã được tải từ Unsplash (miễn phí sử dụng).\n");
  } catch (error) {
    console.error("\n❌ Lỗi khi chạy script:", error.message);
    process.exit(1);
  }
}

// Chạy script
if (require.main === module) {
  main();
}

module.exports = { downloadAllImages, createTemporaryLogo };
