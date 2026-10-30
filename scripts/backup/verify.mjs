#!/usr/bin/env node
import { verify } from "./core.mjs";
try {
  if (process.argv.length !== 3) throw new Error("Usage");
  const m = await verify(process.argv[2]);
  writeOutput(
    JSON.stringify({
      verified: true,
      kind: m.kind,
      createdAt: m.createdAt,
      tables: m.tables.length,
      objectFiles: m.objects?.length ?? null,
      expired: new Date(m.expiresAt) < new Date(),
      warning: "Checksums are integrity checks, not authenticity or proof of Supabase recovery.",
    })
  );
} catch {
  console.error(
    "Verification failed: invalid, incomplete, changed, missing, or unsafe backup. Usage: node scripts/backup/verify.mjs /private/backup-directory"
  );
  process.exitCode = 1;
}

function writeOutput(value) {
  process.stdout.write(String(value) + "\n");
}
