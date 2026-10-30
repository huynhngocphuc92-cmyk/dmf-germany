#!/usr/bin/env node
import { promises as fs } from "node:fs";
import { capture, privateFile } from "./core.mjs";

const help = `Read-only PostgreSQL 17 logical capture (no storage service export).
Usage: node scripts/backup/capture.mjs --config /private/connection.json --ack READ_ONLY_BACKUP --destination /encrypted/private/new-backup [--retention-days 30]
Config is an owned 0600 JSON file: {"host":"db.example","port":"5432","database":"postgres","user":"backup_reader","passfile":"/private/pgpass","sslRootCert":"/private/root.crt"}
Use a pre-existing 0600 libpq password file; no URI/password arguments or ambient PG credentials. TLS verify-full is mandatory. Nothing is scheduled or deleted.\n`;
try {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === "--help") {
    writeOutput(help);
    process.exit(0);
  }
  const options = {};
  for (let i = 0; i < args.length; i += 2) {
    if (
      !["--config", "--ack", "--destination", "--retention-days"].includes(args[i]) ||
      !args[i + 1] ||
      options[args[i]]
    )
      throw new Error("Invalid arguments; use --help");
    options[args[i]] = args[i + 1];
  }
  if (options["--ack"] !== "READ_ONLY_BACKUP" || !options["--config"] || !options["--destination"])
    throw new Error(
      "Explicit config, new destination and READ_ONLY_BACKUP acknowledgement required"
    );
  await privateFile(options["--config"]);
  const c = JSON.parse(await fs.readFile(options["--config"], "utf8"));
  if (Object.keys(c).sort().join(",") !== "database,host,passfile,port,sslRootCert,user")
    throw new Error("Config fields must match --help; credentials are permitted only in passfile");
  await privateFile(c.passfile);
  await privateFile(c.sslRootCert);
  const result = await capture(c, {
    output: options["--destination"],
    passfile: c.passfile,
    retentionDays: Number(options["--retention-days"] || "30"),
  });
  writeOutput(
    JSON.stringify({
      status: "captured; platform and OBJECT BYTES recovery remain unverified",
      directory: result.dir,
      tables: result.manifest.tables.length,
    })
  );
} catch {
  // Config/JSON/path parse errors can include secrets supplied by mistake.
  console.error(
    "Capture refused or failed; no credential diagnostics emitted. Check --help, private input permissions, PG17/TLS/read privileges, and INCOMPLETE marker."
  );
  process.exitCode = 1;
}

function writeOutput(value) {
  process.stdout.write(String(value) + "\n");
}
