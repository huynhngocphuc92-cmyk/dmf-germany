#!/usr/bin/env node

/**
 * Script tự động tải logo từ Supabase Database về public/logo.png
 *
 * Cách sử dụng:
 * 1. Đảm bảo đã có biến môi trường SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY
 * 2. Chạy: node copy-logo-from-db.js
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

// ============================================
// CONFIGURATION
// ============================================

const PUBLIC_DIR = path.join(__dirname, "public");
const LOGO_DEST = path.join(PUBLIC_DIR, "logo.png");

// Keys có thể chứa logo (thử theo thứ tự ưu tiên)
// site_logo là key chính được dùng trong Admin Theme (mục "Logo Website")
const LOGO_KEYS = ["site_logo", "header_logo", "logo_url", "footer_logo"];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Tải file từ URL và lưu vào đường dẫn đích
 */
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(destPath);

    protocol
      .get(url, (response) => {
        // Xử lý redirect
        if (response.statusCode === 301 || response.statusCode === 302) {
          file.close();
          fs.unlinkSync(destPath);
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
        if (fs.existsSync(destPath)) {
          fs.unlinkSync(destPath);
        }
        reject(err);
      });
  });
}

/**
 * Lấy logo URL từ Supabase Database
 */
async function getLogoUrlFromDatabase() {
  try {
    // Import Supabase client (dynamic import vì đây là CommonJS)
    const { createClient } = require("@supabase/supabase-js");

    // Lấy credentials từ environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        "Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) environment variables."
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Thử từng key theo thứ tự ưu tiên
    for (const key of LOGO_KEYS) {
      console.log(`🔍 Đang tìm logo với key: ${key}...`);

      const { data, error } = await supabase
        .from("site_assets")
        .select("value")
        .eq("key", key)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          console.log(`   ⚠️  Key "${key}" không tồn tại trong database.`);
          continue;
        }
        console.error(`   ✗ Lỗi khi query key "${key}":`, error.message);
        continue;
      }

      if (data && data.value) {
        console.log(`   ✓ Tìm thấy logo URL: ${data.value}`);
        return data.value;
      } else {
        console.log(`   ⚠️  Key "${key}" tồn tại nhưng chưa có giá trị.`);
      }
    }

    return null;
  } catch (err) {
    console.error("❌ Lỗi khi kết nối với Supabase:", err.message);
    throw err;
  }
}

/**
 * Main function
 */
async function main() {
  console.log("🚀 Script tải logo từ Database về public/logo.png\n");
  console.log("=".repeat(60));

  try {
    // 1. Lấy logo URL từ database
    console.log("\n📥 Bước 1: Lấy logo URL từ Supabase Database...\n");
    const logoUrl = await getLogoUrlFromDatabase();

    if (!logoUrl) {
      console.log("\n⚠️  KHÔNG TÌM THẤY LOGO TRONG DATABASE!");
      console.log("\nCác key đã thử:");
      LOGO_KEYS.forEach((key) => console.log(`   - ${key}`));
      console.log("\n💡 Hướng dẫn:");
      console.log("   1. Vào trang Admin: http://localhost:3000/admin/theme");
      console.log('   2. Tìm mục "Logo Website" (key: site_logo) hoặc "Header Logo"');
      console.log("   3. Upload logo và lưu lại");
      console.log("   4. Chạy lại script này: npm run copy-logo\n");
      process.exit(1);
    }

    // 2. Tải logo về
    console.log("\n📥 Bước 2: Tải logo từ URL...\n");
    console.log(`   URL: ${logoUrl}`);
    console.log(`   Đích: ${LOGO_DEST}\n`);

    // Đảm bảo thư mục public tồn tại
    if (!fs.existsSync(PUBLIC_DIR)) {
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
      console.log(`✓ Đã tạo thư mục: ${PUBLIC_DIR}`);
    }

    // Xóa file cũ nếu có
    if (fs.existsSync(LOGO_DEST)) {
      console.log(`⚠️  File cũ đã tồn tại, sẽ được ghi đè: ${LOGO_DEST}`);
    }

    await downloadFile(logoUrl, LOGO_DEST);

    // 3. Kiểm tra file đã tải
    const stats = fs.statSync(LOGO_DEST);
    const fileSizeKB = (stats.size / 1024).toFixed(2);

    console.log("=".repeat(60));
    console.log("\n✅ HOÀN THÀNH! Logo đã được tải về thành công.\n");
    console.log("📋 Thông tin file:");
    console.log(`   - Đường dẫn: ${LOGO_DEST}`);
    console.log(`   - Kích thước: ${fileSizeKB} KB`);
    console.log(`   - URL gốc: ${logoUrl}\n`);
    console.log("💡 Lưu ý:");
    console.log("   - File logo.png đã sẵn sàng để sử dụng.");
    console.log("   - Logo sẽ hiển thị trên Header của website.\n");
  } catch (error) {
    console.error("\n❌ Lỗi khi chạy script:", error.message);
    console.error("\n💡 Kiểm tra:");
    console.error("   1. Đã set biến môi trường SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY chưa?");
    console.error("   2. Logo URL có hợp lệ không?");
    console.error("   3. Có quyền ghi vào thư mục public/ không?\n");
    process.exit(1);
  }
}

// Chạy script
if (require.main === module) {
  main();
}

module.exports = { getLogoUrlFromDatabase, downloadFile };
