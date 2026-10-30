// Run explicitly: node --test tests/backup-tools.mjs (native PostgreSQL 17 required).
import { test } from "node:test";
import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  connectionArgs,
  pgEnv,
  localConnection,
  psql,
  restoreLocal,
  destination,
  repository,
  copyObjects,
  verify,
  sha256,
  writePrivate,
} from "../scripts/backup/core.mjs";
import { drill } from "../scripts/backup/drill.mjs";

async function temporary(fn) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "dmf-backup-test-"));
  await fs.chmod(root, 0o700);
  try {
    await fn(root);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
}

test("connection arguments reject libpq URI/option injection and never inherit ambient PG credentials", async () => {
  const c = { host: "db.example.invalid", port: "5432", user: "reader", database: "postgres" };
  for (const bad of [
    { database: "postgresql://secret@remote/db" },
    { database: "host=remote" },
    { host: "remote,other" },
    { host: "remote\nsecret" },
    { user: "reader options=x" },
    { port: "-1" },
  ])
    assert.throws(() => connectionArgs({ ...c, ...bad }));
  assert.deepEqual(connectionArgs(c).slice(-1), ["--no-password"]);
  const previous = process.env.PGPASSWORD;
  process.env.PGPASSWORD = "synthetic-not-a-real-secret";
  try {
    assert.equal(pgEnv().PGPASSWORD, undefined);
    assert.equal(pgEnv().PGSERVICE, undefined);
    assert.equal(pgEnv().PGOPTIONS, undefined);
  } finally {
    if (previous === undefined) delete process.env.PGPASSWORD;
    else process.env.PGPASSWORD = previous;
  }
  assert.throws(() => localConnection({ socket: "/tmp/unapproved" }, "postgres"));
  await assert.rejects(psql({ ...c, host: "127.0.0.1" }, "select 1;"));
  await assert.rejects(
    restoreLocal(
      { socket: "/tmp/unapproved" },
      { manifest: { kind: "synthetic-drill" }, dir: "/tmp" },
      "RESTORE_SYNTHETIC_EPHEMERAL_ONLY"
    )
  );
});

test("capture CLI fails closed before connection without explicit opt-in; diagnostics never echo malformed secret input", async () =>
  temporary(async (root) => {
    const bad = path.join(root, "bad.json");
    await writePrivate(bad, '{"password":"SYNTHETIC_SECRET_DO_NOT_ECHO"');
    const result = spawnSync(
      process.execPath,
      [
        "scripts/backup/capture.mjs",
        "--config",
        bad,
        "--destination",
        path.join(root, "unused"),
        "--ack",
        "READ_ONLY_BACKUP",
      ],
      { cwd: repository, encoding: "utf8" }
    );
    assert.equal(result.status, 1);
    assert.doesNotMatch(result.stdout + result.stderr, /SYNTHETIC_SECRET_DO_NOT_ECHO/);
    await assert.rejects(fs.stat(path.join(root, "unused")));
    const noAck = spawnSync(process.execPath, ["scripts/backup/capture.mjs"], {
      cwd: repository,
      encoding: "utf8",
    });
    assert.equal(noAck.status, 1);
  }));

test("private destinations refuse overwrites and repository paths; object copy rejects symlinks", async () =>
  temporary(async (root) => {
    const dir = await destination(path.join(root, "new"));
    assert.equal((await fs.stat(dir)).mode & 0o777, 0o700);
    await assert.rejects(destination(dir));
    await assert.rejects(destination(path.join(repository, "unsafe-tracked-backup")));
    const source = path.join(root, "objects");
    await fs.mkdir(source, { mode: 0o700 });
    await writePrivate(path.join(source, "bytes"), Buffer.from([0, 255, 42]));
    await fs.symlink("bytes", path.join(source, "link"));
    await assert.rejects(copyObjects(source, path.join(root, "copied")));
  }));

test("verification detects tampering, missing bytes, broad permissions and symlinks", async () =>
  temporary(async (root) => {
    const dir = await destination(path.join(root, "backup"));
    const files = [];
    for (const name of ["database.dump", "roles-inventory.json"]) {
      const bytes = Buffer.from(name);
      await writePrivate(path.join(dir, name), bytes);
      files.push({ path: name, bytes: bytes.length, sha256: sha256(bytes) });
    }
    const manifest = { format: 1, files, objects: null };
    await writePrivate(path.join(dir, "manifest.json"), JSON.stringify(manifest));
    await verify(dir);
    await fs.chmod(path.join(dir, "database.dump"), 0o644);
    await assert.rejects(verify(dir));
    await fs.chmod(path.join(dir, "database.dump"), 0o600);
    await fs.writeFile(path.join(dir, "database.dump"), "tampered");
    await assert.rejects(verify(dir));
    await fs.writeFile(path.join(dir, "database.dump"), "database.dump");
    await fs.rename(path.join(dir, "database.dump"), path.join(root, "bytes"));
    await assert.rejects(verify(dir));
    await fs.symlink(path.join(root, "bytes"), path.join(dir, "database.dump"));
    await assert.rejects(verify(dir));
  }));

test(
  "real PG17 socket-only recovery preserves production-shaped data, access controls and private object bytes",
  {
    timeout: 60000,
    skip:
      process.env.DMF_SKIP_PG_DRILL === "1"
        ? "Native PG17 recovery drill is a separate local release check"
        : false,
  },
  async () =>
    temporary(async (root) => {
      const evidence = await drill({ output: path.join(root, "synthetic-backup") });
      assert.equal(evidence.status, "PASS");
      assert.equal(evidence.tables.find((t) => t.name === "intake_submissions").rows, "3");
      assert.equal(evidence.tables.find((t) => t.name === "notification_deliveries").rows, "8");
      assert.equal(evidence.objectFiles.length, 2);
    })
);
