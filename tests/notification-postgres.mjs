// Self-contained PG17 test; no connection strings, TCP, existing clusters or external providers.
import { execFileSync, spawn } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import assert from "node:assert/strict";
const bin = process.env.DMF_TEST_PG_BIN || "/opt/homebrew/opt/postgresql@17/bin";
const root = mkdtempSync(join(tmpdir(), "dmf-notify-"));
const cluster = join(root, "db");
const run = (command, args) =>
  execFileSync(join(bin, command), args, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
const args = [
  "-X",
  "-q",
  "-v",
  "ON_ERROR_STOP=1",
  "-h",
  root,
  "-U",
  "postgres",
  "-d",
  "postgres",
  "-At",
];
const sql = (input) =>
  execFileSync(join(bin, "psql"), args, {
    input,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  }).trim();
const check = (query, expected) => assert.equal(sql(query), expected);
const migration = readdirSync("supabase/migrations").find((name) =>
  name.endsWith("_notification_recovery_ops.sql")
);
let started = false;
try {
  run("initdb", ["-D", cluster, "-U", "postgres", "-A", "trust", "--no-locale"]);
  run("pg_ctl", [
    "-D",
    cluster,
    "-l",
    join(root, "server.log"),
    "-o",
    `-k ${root} -c listen_addresses='' -c fsync=off`,
    "-w",
    "start",
  ]);
  started = true;
  sql(`create role anon; create role authenticated; create role service_role bypassrls;
    create table inquiries(id uuid primary key,status text); create table leads(id uuid primary key);
    create table candidates(id uuid primary key,is_featured boolean);
    create function dmf_is_admin() returns boolean language sql as $$select false$$;`);
  sql(readFileSync("supabase/migrations/20260929100707_reliable_intake.sql", "utf8"));
  sql(`insert into intake_submissions(id,kind,payload,payload_hash) values('10000000-0000-4000-8000-000000000001','contact','{"email":"fixture@example.invalid"}','fixture');
    insert into notification_deliveries(id,submission_id,channel,status,sent_at) values('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','email','sent','2025-01-01Z');`);
  sql(readFileSync(join("supabase/migrations", migration), "utf8"));
  check("select sent_at='2025-01-01Z'::timestamptz from notification_deliveries", "t");
  check("select dmf_claim_notification(id) is null from notification_deliveries", "t");
  for (const role of ["anon", "authenticated"]) {
    check(
      `select bool_and(not has_function_privilege('${role}',p.oid,'EXECUTE')) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname in ('dmf_claim_notification_retry','dmf_claim_notification_batch','dmf_notification_health','dmf_claim_notification','dmf_finish_notification')`,
      "t"
    );
  }
  sql("update notification_deliveries set sent_at=null,status='pending'");
  const id = "20000000-0000-4000-8000-000000000001";
  const claim = (manual = false) =>
    sql(`set role service_role; select dmf_claim_notification_retry('${id}',${manual})`)
      .split("\n")
      .at(-1);
  const first = JSON.parse(claim());
  assert.equal(claim(true), ""); // active lease cannot be bypassed
  check(
    `select dmf_finish_notification('${id}','${first.attemptToken}','failed','provider_unavailable')`,
    "t"
  );
  assert.equal(claim(), ""); // backoff enforced
  check(
    "select next_attempt_at>=updated_at+interval '60 seconds' from notification_deliveries",
    "t"
  );
  const second = JSON.parse(claim(true));
  check(`select dmf_finish_notification('${id}','${first.attemptToken}','sent',null)`, "f");
  sql("update notification_deliveries set lease_until=now()-interval '1 second'");
  check(`select dmf_finish_notification('${id}','${second.attemptToken}','sent',null)`, "f");
  assert.equal(claim(), ""); // expired lease still observes recovery delay
  sql("update notification_deliveries set next_attempt_at=now()-interval '1 second'");
  const third = JSON.parse(claim());
  check(
    `select dmf_finish_notification('${id}','${third.attemptToken}','skipped','smtp_not_configured')`,
    "t"
  );
  sql("update notification_deliveries set next_attempt_at=now()-interval '1 second'");
  assert.equal(claim(), ""); // skipped never automatically retried
  const fourth = JSON.parse(claim(true));
  check(`select dmf_finish_notification('${id}','${fourth.attemptToken}','failed',null)`, "t");
  const fifth = JSON.parse(claim(true));
  check(`select dmf_finish_notification('${id}','${fifth.attemptToken}','failed',null)`, "t");
  assert.equal(claim(true), ""); // manual retry cannot defeat exhaustion
  check("select (dmf_notification_health()->>'exhausted')::integer", "1");

  sql(`truncate notification_deliveries;
    insert into intake_submissions(id,kind,payload,payload_hash) select gen_random_uuid(),'contact','{"email":"fixture@example.invalid"}'::jsonb,'fixture' from generate_series(1,6);
    insert into notification_deliveries(submission_id,channel) select id,'email' from intake_submissions order by id limit 6;`);
  const worker = () =>
    new Promise((resolve, reject) => {
      const child = spawn(join(bin, "psql"), args, { stdio: ["pipe", "pipe", "pipe"] });
      let out = "",
        err = "";
      child.stdout.on("data", (chunk) => {
        out += chunk;
      });
      child.stderr.on("data", (chunk) => {
        err += chunk;
      });
      child.on("error", reject);
      child.on("exit", (code) =>
        code === 0
          ? resolve(out.split("\n").find((line) => line.startsWith("[")))
          : reject(new Error(err))
      );
      child.stdin.end(
        "begin; set role service_role; select dmf_claim_notification_batch(); select pg_sleep(0.4); commit;"
      );
    });
  const batches = (await Promise.all([worker(), worker()])).map(JSON.parse);
  assert.deepEqual(
    batches.map((batch) => batch.length),
    [3, 3]
  );
  assert.equal(new Set(batches.flat().map((job) => job.id)).size, 6);
  check("select count(*) from notification_deliveries where attempts=1 and status='sending'", "6");
  console.error(
    "PASS: PG17 migration preservation, permissions, backoff, manual retry, expiry/token fencing, skipped/exhausted exclusion and overlapping workers (6 unique claims)."
  );
} finally {
  if (started) run("pg_ctl", ["-D", cluster, "-m", "immediate", "-w", "stop"]);
  rmSync(root, { recursive: true, force: true });
}
