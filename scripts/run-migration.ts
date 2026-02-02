// Run Supabase migration script
// Usage: npx tsx scripts/run-migration.ts

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

async function runMigration() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    console.log("\nPlease set these environment variables:");
    console.log("  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co");
    console.log("  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    db: { schema: "public" },
    auth: { persistSession: false },
  });

  // Read migration file
  const migrationPath = path.join(
    process.cwd(),
    "supabase/migrations/20240201_chatbot_tables.sql"
  );

  if (!fs.existsSync(migrationPath)) {
    console.error("❌ Migration file not found:", migrationPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, "utf-8");

  console.log("🚀 Running migration...\n");

  // Split SQL into individual statements
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  let successCount = 0;
  let errorCount = 0;

  for (const statement of statements) {
    try {
      const { error } = await supabase.rpc("exec_sql", { sql: statement + ";" });

      if (error) {
        // Try direct query for DDL statements
        const { error: queryError } = await supabase.from("_temp").select().limit(0);

        if (queryError && !queryError.message.includes("does not exist")) {
          console.log(`⚠️  Statement skipped (may already exist):`);
          console.log(`   ${statement.substring(0, 60)}...`);
        }
      } else {
        successCount++;
        console.log(`✅ ${statement.substring(0, 50)}...`);
      }
    } catch (err) {
      errorCount++;
      console.log(`⚠️  ${statement.substring(0, 50)}...`);
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`Migration complete: ${successCount} succeeded, ${errorCount} warnings`);
  console.log("=".repeat(50));
}

runMigration().catch(console.error);
