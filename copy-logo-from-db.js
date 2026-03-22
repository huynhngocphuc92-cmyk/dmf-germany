#!/usr/bin/env node

/**
 * Fetch the logo URL from Supabase and save it to public/logo.png
 *
 * Usage:
 * 1. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are available
 * 2. Run: node copy-logo-from-db.js
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

// Candidate keys that may contain the logo URL, ordered by priority.
// site_logo is the main key used by the Admin Theme page.
const LOGO_KEYS = ["site_logo", "header_logo", "logo_url", "footer_logo"];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Download a file from a URL into the destination path.
 */
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(destPath);

    protocol
      .get(url, (response) => {
        // Follow redirects.
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
 * Read the logo URL from Supabase.
 */
async function getLogoUrlFromDatabase() {
  try {
    // Import Supabase dynamically because this script is CommonJS.
    const { createClient } = require("@supabase/supabase-js");

    // Read credentials from environment variables.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        "Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) environment variables."
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Try each supported key in priority order.
    for (const key of LOGO_KEYS) {
      console.log(`🔍 Looking up logo key: ${key}...`);

      const { data, error } = await supabase
        .from("site_assets")
        .select("value")
        .eq("key", key)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          console.log(`   ⚠️  Key "${key}" does not exist in the database.`);
          continue;
        }
        console.error(`   ✗ Query failed for key "${key}":`, error.message);
        continue;
      }

      if (data && data.value) {
        console.log(`   ✓ Found logo URL: ${data.value}`);
        return data.value;
      } else {
        console.log(`   ⚠️  Key "${key}" exists but has no value.`);
      }
    }

    return null;
  } catch (err) {
    console.error("❌ Failed to connect to Supabase:", err.message);
    throw err;
  }
}

/**
 * Main function
 */
async function main() {
  console.log("🚀 Copying the logo from the database into public/logo.png\n");
  console.log("=".repeat(60));

  try {
    // 1. Resolve the logo URL from Supabase.
    console.log("\n📥 Step 1: Reading the logo URL from Supabase...\n");
    const logoUrl = await getLogoUrlFromDatabase();

    if (!logoUrl) {
      console.log("\n⚠️  No logo was found in the database.");
      console.log("\nKeys checked:");
      LOGO_KEYS.forEach((key) => console.log(`   - ${key}`));
      console.log("\n💡 Next steps:");
      console.log("   1. Open the admin page: http://localhost:3000/admin/theme");
      console.log('   2. Update "Logo Website" (key: site_logo) or "Header Logo"');
      console.log("   3. Save the new asset");
      console.log("   4. Run this script again: npm run copy-logo\n");
      process.exit(1);
    }

    // 2. Download the resolved logo file.
    console.log("\n📥 Step 2: Downloading the logo asset...\n");
    console.log(`   URL: ${logoUrl}`);
    console.log(`   Destination: ${LOGO_DEST}\n`);

    // Ensure the public directory exists.
    if (!fs.existsSync(PUBLIC_DIR)) {
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
      console.log(`✓ Created directory: ${PUBLIC_DIR}`);
    }

    // Warn if an existing logo file will be overwritten.
    if (fs.existsSync(LOGO_DEST)) {
      console.log(`⚠️  Existing file will be overwritten: ${LOGO_DEST}`);
    }

    await downloadFile(logoUrl, LOGO_DEST);

    // 3. Report the saved file details.
    const stats = fs.statSync(LOGO_DEST);
    const fileSizeKB = (stats.size / 1024).toFixed(2);

    console.log("=".repeat(60));
    console.log("\n✅ Done. The logo was copied successfully.\n");
    console.log("📋 File details:");
    console.log(`   - Path: ${LOGO_DEST}`);
    console.log(`   - Size: ${fileSizeKB} KB`);
    console.log(`   - Source URL: ${logoUrl}\n`);
    console.log("💡 Notes:");
    console.log("   - public/logo.png is ready to use.");
    console.log("   - The logo will appear in the website header.\n");
  } catch (error) {
    console.error("\n❌ Script failed:", error.message);
    console.error("\n💡 Check the following:");
    console.error("   1. SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are configured");
    console.error("   2. The logo URL stored in the database is valid");
    console.error("   3. The script can write into the public/ directory\n");
    process.exit(1);
  }
}

// Run the script when executed directly.
if (require.main === module) {
  main();
}

module.exports = { getLogoUrlFromDatabase, downloadFile };
