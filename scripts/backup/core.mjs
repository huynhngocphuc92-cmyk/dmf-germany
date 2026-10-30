import { spawn } from "node:child_process";
import { promises as fs, constants } from "node:fs";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import os from "node:os";
import { createHash, randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

process.umask(0o077);
export const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const bin = process.env.DMF_PG_BIN || "/opt/homebrew/opt/postgresql@17/bin";
export const quote = (s) => '"' + s.replaceAll('"', '""') + '"';
export const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
export async function fileDigest(file) {
  const handle = await fs.open(file, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    if (!(await handle.stat()).isFile()) throw new Error("Regular file required");
    const hash = createHash("sha256");
    let bytes = 0;
    for await (const chunk of handle.createReadStream({ autoClose: true })) {
      hash.update(chunk);
      bytes += chunk.length;
    }
    return { bytes, sha256: hash.digest("hex") };
  } finally {
    await handle.close();
  }
}
async function copyRegular(source, target) {
  const input = await fs.open(source, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    if (!(await input.stat()).isFile()) throw new Error("Regular object file required");
    const output = await fs.open(target, "wx", 0o600);
    try {
      await pipeline(
        input.createReadStream({ autoClose: true }),
        output.createWriteStream({ autoClose: true })
      );
    } finally {
      await output.close();
    }
  } finally {
    await input.close();
  }
  return fileDigest(target);
}
const clusters = new WeakSet();
const localConnections = new WeakSet();
const approved = new WeakMap();

// Deliberately discard ambient libpq connection, service, options, and password variables.
export function pgEnv(passfile) {
  const env = {
    PATH: process.env.PATH,
    HOME: os.homedir(),
    LC_ALL: "C",
    TZ: "UTC",
    PGCONNECT_TIMEOUT: "15",
  };
  if (passfile) env.PGPASSFILE = passfile;
  return env;
}
export async function run(tool, args, { input, env = pgEnv(), outputFile } = {}) {
  const outputHandle = outputFile ? await fs.open(outputFile, "wx", 0o600) : null;
  try {
    return await new Promise((resolve, reject) => {
      const child = spawn(path.join(bin, tool), args, {
        env,
        stdio: ["pipe", outputHandle?.fd ?? "pipe", "pipe"],
      });
      const output = [];
      child.stdout?.on("data", (b) => output.push(b));
      // PostgreSQL diagnostics may contain row values, connection strings, or credentials.
      child.stderr.resume();
      child.on("error", () => reject(new Error(`${tool} could not start (check DMF_PG_BIN)`)));
      child.on("close", (code) =>
        code === 0
          ? resolve(Buffer.concat(output).toString())
          : reject(new Error(`${tool} failed (exit ${code}); diagnostics suppressed for privacy`))
      );
      child.stdin.on("error", () => {});
      child.stdin.end(input);
    });
  } finally {
    await outputHandle?.close();
  }
}
export async function versions() {
  const result = {};
  for (const tool of ["psql", "pg_dump", "pg_restore"]) {
    result[tool] = (await run(tool, ["--version"])).trim();
    if (!/\b17\./.test(result[tool])) throw new Error("PostgreSQL 17 tools required");
  }
  return result;
}
export function connectionArgs(c) {
  for (const key of ["host", "database", "user", "port"]) {
    if (typeof c[key] !== "string" || !c[key] || /[\s=\x00-\x1f]/.test(c[key]))
      throw new Error("Invalid discrete connection field");
  }
  if (
    /[/:?@]/.test(c.database) ||
    /[:/?@]/.test(c.user) ||
    !/^\d{1,5}$/.test(c.port) ||
    Number(c.port) > 65535 ||
    Number(c.port) < 1
  )
    throw new Error("Connection URI/options are forbidden");
  // Host may be an absolute Unix socket directory; never accept URI or host lists.
  if (/[,@?]/.test(c.host) || (c.host.includes(":") && c.host !== "::1"))
    throw new Error("Invalid host");
  return [
    "--host",
    c.host,
    "--port",
    c.port,
    "--username",
    c.user,
    "--dbname",
    c.database,
    "--no-password",
  ];
}
export async function privateFile(file) {
  const s = await fs.lstat(file);
  if (!s.isFile() || s.isSymbolicLink() || s.mode & 0o077 || s.uid !== process.getuid())
    throw new Error("Input must be an owned private regular file (0600)");
  return path.resolve(file);
}
export async function destination(requested) {
  const dir = path.resolve(
    requested ||
      path.join(
        os.homedir(),
        ".local/share/dmf-backups",
        new Date().toISOString().replaceAll(":", "-") + "-" + randomUUID()
      )
  );
  await fs.mkdir(path.dirname(dir), { recursive: true, mode: 0o700 });
  const parent = await fs.realpath(path.dirname(dir));
  const resolved = path.join(parent, path.basename(dir));
  const root = await fs.realpath(repository);
  const inside = resolved === root || resolved.startsWith(root + path.sep);
  if (inside && !resolved.startsWith(path.join(root, ".local-backups") + path.sep))
    throw new Error("Backup destination must be outside the repository or under .local-backups/");
  await fs.mkdir(resolved, { mode: 0o700 }); // exclusive: refuse existing destination
  return resolved;
}
export async function writePrivate(file, value) {
  await fs.writeFile(file, value, { mode: 0o600, flag: "wx" });
}
export async function psql(c, sql, env = pgEnv()) {
  if (!localConnections.has(c))
    throw new Error("SQL is restricted to approved ephemeral drill connections");
  return run("psql", [...connectionArgs(c), "-X", "-qAt", "-v", "ON_ERROR_STOP=1"], {
    input: sql,
    env,
  });
}

// Keep one read-only transaction open while pg_dump imports its exported snapshot.
async function snapshotSession(c, env) {
  const child = spawn(
    path.join(bin, "psql"),
    [...connectionArgs(c), "-X", "-qAt", "-v", "ON_ERROR_STOP=1"],
    { env, stdio: ["pipe", "pipe", "pipe"] }
  );
  child.stderr.resume();
  child.stdin.on("error", () => {});
  let pending,
    buffer = "",
    dead = false;
  child.stdout.on("data", (b) => {
    buffer += b.toString();
    if (pending && buffer.includes(pending.marker + "\n")) {
      const p = pending;
      pending = undefined;
      const end = buffer.indexOf(p.marker + "\n");
      const output = buffer.slice(0, end).trim();
      buffer = buffer.slice(end + p.marker.length + 1);
      p.resolve(output);
    }
  });
  const fail = () => {
    dead = true;
    if (pending) {
      pending.reject(new Error("Snapshot session failed; diagnostics suppressed"));
      pending = undefined;
    }
  };
  child.on("error", fail);
  child.on("close", fail);
  const query = (sql) =>
    new Promise((resolve, reject) => {
      if (dead || pending) return reject(new Error("Invalid snapshot session state"));
      const marker = "dmf_" + randomUUID();
      pending = { resolve, reject, marker };
      child.stdin.write(sql + "\n\\echo " + marker + "\n");
    });
  try {
    const snapshot = await query(
      "begin isolation level repeatable read read only; select pg_export_snapshot();"
    );
    return {
      snapshot,
      query,
      close: () => {
        child.stdin.end("rollback;\n");
      },
    };
  } catch (e) {
    child.kill();
    throw e;
  }
}

export async function copyObjects(source, target) {
  const root = await fs.lstat(source);
  if (
    !root.isDirectory() ||
    root.isSymbolicLink() ||
    root.mode & 0o077 ||
    root.uid !== process.getuid()
  )
    throw new Error("Object source must be an owned private directory");
  await fs.mkdir(target, { mode: 0o700 });
  const files = [];
  async function walk(src, dst, prefix = "") {
    for (const name of (await fs.readdir(src)).sort()) {
      const from = path.join(src, name),
        to = path.join(dst, name),
        relative = prefix + name;
      const s = await fs.lstat(from);
      if (s.isSymbolicLink() || s.mode & 0o077 || s.uid !== process.getuid())
        throw new Error("Object symlinks or unsafe permissions are forbidden");
      if (s.isDirectory()) {
        await fs.mkdir(to, { mode: 0o700 });
        await walk(from, to, relative + "/");
      } else if (s.isFile()) {
        files.push({ path: relative, ...(await copyRegular(from, to)) });
      } else throw new Error("Special object files are forbidden");
    }
  }
  await walk(source, target);
  return files;
}

export async function capture(
  c,
  { output, passfile, objectSource, kind = "remote-logical", retentionDays = 30 } = {}
) {
  if (!Number.isInteger(retentionDays) || retentionDays < 1 || retentionDays > 365)
    throw new Error("Retention must be 1..365 days");
  connectionArgs(c);
  if (kind === "synthetic-drill" && !localConnections.has(c))
    throw new Error("Synthetic capture requires an approved ephemeral connection");
  const toolVersions = await versions();
  const env = pgEnv(passfile);
  env.PGOPTIONS = "-c default_transaction_read_only=on -c row_security=off";
  if (kind !== "synthetic-drill") {
    if (!c.sslRootCert) throw new Error("Explicit TLS CA required for remote capture");
    env.PGSSLMODE = "verify-full";
    env.PGSSLROOTCERT = c.sslRootCert;
  }
  const dir = await destination(output);
  await writePrivate(
    path.join(dir, "INCOMPLETE"),
    "Do not use until manifest.json exists and verification passes.\n"
  );
  const startedAt = new Date().toISOString();
  const session = await snapshotSession(c, env);
  try {
    const snapshotAt = new Date(
      await session.query("select transaction_timestamp();")
    ).toISOString();
    const serverVersion = await session.query("show server_version;");
    if (!/^17\./.test(serverVersion)) throw new Error("PostgreSQL 17 server required");
    const tables = JSON.parse(
      await session.query(
        `select coalesce(json_agg(t order by schema,name),'[]'::json) from (select n.nspname as schema,c.relname as name from pg_class c join pg_namespace n on n.oid=c.relnamespace where c.relkind in ('r','p') and n.nspname not in ('pg_catalog','information_schema') and n.nspname not like 'pg_toast%' and not c.relispartition) t;`
      )
    );
    for (const t of tables)
      t.rows = await session.query(
        `select count(*)::text from ${quote(t.schema)}.${quote(t.name)};`
      );
    const roles = JSON.parse(
      await session.query(
        `select coalesce(json_agg(t order by rolname),'[]'::json) from (select rolname,rolsuper,rolinherit,rolcreaterole,rolcreatedb,rolcanlogin,rolreplication,rolbypassrls from pg_roles) t;`
      )
    );
    const memberships = JSON.parse(
      await session.query(
        `select coalesce(json_agg(t order by role,member),'[]'::json) from (select r.rolname as role,m.rolname as member,a.admin_option from pg_auth_members a join pg_roles r on r.oid=a.roleid join pg_roles m on m.oid=a.member) t;`
      )
    );
    await run(
      "pg_dump",
      [...connectionArgs(c), "--format=custom", "--no-tablespaces", "--snapshot", session.snapshot],
      { env, outputFile: path.join(dir, "database.dump") }
    );
    await fs.chmod(path.join(dir, "database.dump"), 0o600);
    await writePrivate(
      path.join(dir, "roles-inventory.json"),
      JSON.stringify({ roles, memberships }, null, 2) + "\n"
    );
    const objects = objectSource
      ? await copyObjects(objectSource, path.join(dir, "objects"))
      : null;
    const files = [];
    for (const name of ["database.dump", "roles-inventory.json"]) {
      files.push({ path: name, ...(await fileDigest(path.join(dir, name))) });
    }
    const createdAt = new Date().toISOString();
    const manifest = {
      format: 1,
      kind,
      createdAt,
      startedAt,
      snapshotAt,
      expiresAt: new Date(Date.now() + retentionDays * 86400000).toISOString(),
      retentionDays,
      serverVersion,
      toolVersions,
      consistency:
        "One exported repeatable-read read-only PostgreSQL snapshot for dump, row counts and role inventory; object copy is separate and not transactionally consistent with DB.",
      tables,
      files,
      objects,
      coverage: {
        database:
          "Logical database schema/data, functions, triggers, RLS, ACLs and owner references as emitted by pg_dump; extension/platform exclusions require review.",
        roles:
          "Inventory only, no passwords, role creation or configuration; never automatically restored.",
        auth: "Database rows only if accessible; no Supabase Auth service/configuration/secrets or provider recovery.",
        storage: objects
          ? "SQL metadata plus separately copied local directory bytes; not a Supabase Storage export."
          : "SQL metadata only; OBJECT BYTES NOT CAPTURED.",
        platform:
          "Supabase project configuration, API/JWT secrets, SMTP/OAuth settings, extensions/service versions, billing and infrastructure NOT CAPTURED.",
        encryption:
          "Not encrypted by this tool. Use an encrypted volume and encrypted offline copies with separately managed keys.",
      },
    };
    await writePrivate(path.join(dir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
    await fs.unlink(path.join(dir, "INCOMPLETE"));
    approved.set(manifest, { dir, digest: sha256(JSON.stringify(manifest)) });
    return { dir, manifest };
  } finally {
    session.close();
  }
}

export async function verify(dir) {
  const root = await fs.lstat(dir);
  if (
    !root.isDirectory() ||
    root.isSymbolicLink() ||
    root.mode & 0o077 ||
    root.uid !== process.getuid()
  )
    throw new Error("Backup directory must be owned and private (0700)");
  try {
    await fs.lstat(path.join(dir, "INCOMPLETE"));
    throw new Error("Incomplete backup");
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  await privateFile(path.join(dir, "manifest.json"));
  const manifest = JSON.parse(await fs.readFile(path.join(dir, "manifest.json"), "utf8"));
  if (
    manifest.format !== 1 ||
    !Array.isArray(manifest.files) ||
    manifest.files.length !== 2 ||
    manifest.files
      .map((f) => f.path)
      .sort()
      .join(",") !== "database.dump,roles-inventory.json"
  )
    throw new Error("Invalid backup manifest");
  const expected = new Map(manifest.files.map((f) => [f.path, f]));
  if (manifest.objects !== null) {
    if (!Array.isArray(manifest.objects)) throw new Error("Invalid object manifest");
    for (const f of manifest.objects) expected.set("objects/" + f.path, f);
  }
  const actual = new Set();
  async function walk(base, prefix = "") {
    for (const name of await fs.readdir(base)) {
      const relative = prefix + name,
        file = path.join(base, name),
        s = await fs.lstat(file);
      if (s.isSymbolicLink() || s.mode & 0o077 || s.uid !== process.getuid())
        throw new Error("Unsafe backup permissions or symlink");
      if (s.isDirectory()) await walk(file, relative + "/");
      else if (s.isFile()) {
        if (relative === "manifest.json") continue;
        const entry = expected.get(relative);
        const digest = await fileDigest(file);
        if (!entry || digest.bytes !== entry.bytes || digest.sha256 !== entry.sha256)
          throw new Error("Backup checksum or file inventory mismatch");
        actual.add(relative);
      } else throw new Error("Unsafe backup file");
    }
  }
  await walk(dir);
  if (actual.size !== expected.size) throw new Error("Backup files missing");
  return manifest;
}

// This capability is never read from a user-supplied marker/config file. Only this
// process can approve the private no-TCP cluster it just initialized.
export async function createCluster() {
  await versions();
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "dmf-recovery-"));
  await fs.chmod(root, 0o700);
  const socket = path.join(root, "socket");
  await fs.mkdir(socket, { mode: 0o700 });
  const data = path.join(root, "data");
  try {
    await run("initdb", [
      "-D",
      data,
      "--username=dmf_drill",
      "--auth-local=trust",
      "--auth-host=reject",
      "--no-locale",
      "--encoding=UTF8",
    ]);
    await fs.appendFile(
      path.join(data, "postgresql.conf"),
      `\nlisten_addresses = ''\nunix_socket_directories = '${socket.replaceAll("'", "''")}'\nunix_socket_permissions = 0700\nport = 55439\n`
    );
    await run("pg_ctl", ["-D", data, "-l", path.join(root, "server.log"), "-w", "start"]);
  } catch (error) {
    let running = false;
    try {
      await fs.stat(path.join(data, "postmaster.pid"));
      running = true;
    } catch {}
    if (running) await run("pg_ctl", ["-D", data, "-m", "immediate", "-w", "stop"]);
    await fs.rm(root, { recursive: true, force: true });
    throw error;
  }
  const cluster = Object.freeze({ root, data, socket });
  clusters.add(cluster);
  return cluster;
}
export function localConnection(cluster, database) {
  if (
    !clusters.has(cluster) ||
    !["postgres", "dmf_drill_source", "dmf_drill_restore"].includes(database)
  )
    throw new Error("Only this process's ephemeral drill targets are approved");
  const c = Object.freeze({ host: cluster.socket, port: "55439", user: "dmf_drill", database });
  localConnections.add(c);
  return c;
}
export async function closeCluster(cluster) {
  if (!clusters.has(cluster)) throw new Error("Unapproved cluster");
  await run("pg_ctl", ["-D", cluster.data, "-m", "immediate", "-w", "stop"]);
  clusters.delete(cluster);
  await fs.rm(cluster.root, { recursive: true });
}
export async function restoreLocal(cluster, backup, acknowledgement) {
  if (
    acknowledgement !== "RESTORE_SYNTHETIC_EPHEMERAL_ONLY" ||
    approved.get(backup.manifest)?.dir !== backup.dir ||
    backup.manifest.kind !== "synthetic-drill"
  )
    throw new Error("Restore requires an approved synthetic capture and explicit acknowledgement");
  const target = localConnection(cluster, "dmf_drill_restore");
  const checked = await verify(backup.dir);
  if (sha256(JSON.stringify(checked)) !== approved.get(backup.manifest).digest)
    throw new Error("Approved manifest changed");
  await psql(
    localConnection(cluster, "postgres"),
    "create database dmf_drill_restore template template0;"
  );
  // No clean, create, owner remapping, or arbitrary SQL input. Existing target fails.
  await run("pg_restore", [
    ...connectionArgs(target),
    "--exit-on-error",
    "--single-transaction",
    path.join(backup.dir, "database.dump"),
  ]);
  return target;
}
