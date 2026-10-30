#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { restore as renderSchema } from "../../tests/fixtures/backup-production-schema.mjs";
import {
  capture,
  createCluster,
  closeCluster,
  localConnection,
  psql,
  quote,
  restoreLocal,
  sha256,
  copyObjects,
  verify,
  writePrivate,
} from "./core.mjs";

const seed = `
insert into auth.users(id,email,raw_app_meta_data) values ('10000000-0000-4000-8000-000000000001','synthetic-admin@example.invalid','{"role":"admin"}');
set request.jwt.claim.sub='10000000-0000-4000-8000-000000000001';
insert into public.candidates(id,full_name,profession,publication_status,publication_valid_until,email)
values ('20000000-0000-4000-8000-000000000001','Synthetic Drill Candidate','Nurse','draft',current_date+30,'synthetic-candidate@example.invalid');
update public.candidates set publication_status='published',publication_consent_note='Synthetic consent for local recovery drill only' where id='20000000-0000-4000-8000-000000000001';
select public.dmf_receive_intake('30000000-0000-4000-8000-000000000001','contact','{"name":"Synthetic Contact","email":"contact@example.invalid","message":"Local recovery drill only","campaign":{"source":"drill"}}');
select public.dmf_receive_intake('30000000-0000-4000-8000-000000000002','lead','{"email":"lead@example.invalid","company":"Synthetic GmbH","interest":"recovery drill","sourcePath":"/synthetic"}');
select public.dmf_receive_intake('30000000-0000-4000-8000-000000000003','profile','{"candidateId":"20000000-0000-4000-8000-000000000001","name":"Synthetic Profile","email":"profile@example.invalid","message":"Synthetic profile request"}');
update public.notification_deliveries set status=case channel when 'email' then 'sent' when 'telegram' then 'failed' else 'pending' end, attempts=case channel when 'auto_reply' then 0 else 1 end,last_error=case channel when 'telegram' then 'Synthetic transport failure' else null end,sent_at=case channel when 'email' then now() else null end;
select public.dmf_claim_notification(id) from public.notification_deliveries where submission_id='30000000-0000-4000-8000-000000000003' and channel='auto_reply';
insert into public.intake_rate_limits(key,count,expires_at) values ('synthetic-only',2,now()+interval '1 hour');
insert into storage.buckets(id,name,public) values ('synthetic-private','synthetic-private',false);
insert into storage.objects(bucket_id,name,metadata) values ('synthetic-private','nested/example.bin','{"synthetic":true,"size":8}'),('synthetic-private','empty.txt','{"synthetic":true,"size":0}');
`;

async function content(c, tables) {
  const rows = [];
  for (const t of tables) {
    const value = await psql(
      c,
      `select coalesce(jsonb_agg(v order by v::text),'[]'::jsonb)::text from (select to_jsonb(t) v from ${quote(t.schema)}.${quote(t.name)} t) s;`
    );
    rows.push({ schema: t.schema, name: t.name, sha256: sha256(value) });
  }
  return rows;
}
async function permissions(c) {
  // Include restored ACLs, RLS, policies, function bodies/grants, constraints and triggers.
  return psql(
    c,
    `select jsonb_build_object(
 'schemas',(select jsonb_agg(v order by v::text) from (select jsonb_build_array(n.nspname,n.nspacl::text,pg_get_userbyid(n.nspowner)) v from pg_namespace n where n.nspname in ('public','auth','storage','dmf_private')) s),
 'indexes',(select jsonb_agg(to_jsonb(i) order by to_jsonb(i)::text) from pg_indexes i where schemaname in ('public','auth','storage')),
 'views',(select jsonb_agg(v order by v::text) from (select jsonb_build_array(n.nspname,c.relname,pg_get_viewdef(c.oid),c.reloptions) v from pg_class c join pg_namespace n on n.oid=c.relnamespace where c.relkind='v' and n.nspname='public') s),
 'relations',(select jsonb_agg(v order by v::text) from (select jsonb_build_array(n.nspname,c.relname,c.relrowsecurity,c.relforcerowsecurity,c.relacl::text,pg_get_userbyid(c.relowner)) v from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname in ('public','auth','storage','dmf_private') and c.relkind in ('r','v','S')) s),
 'columns',(select jsonb_agg(v order by v::text) from (select jsonb_build_array(n.nspname,c.relname,a.attname,a.attacl::text,a.attnotnull,format_type(a.atttypid,a.atttypmod),pg_get_expr(d.adbin,d.adrelid)) v from pg_attribute a join pg_class c on c.oid=a.attrelid join pg_namespace n on n.oid=c.relnamespace left join pg_attrdef d on d.adrelid=a.attrelid and d.adnum=a.attnum where n.nspname in ('public','auth','storage','dmf_private') and a.attnum>0 and not a.attisdropped) s),
 'policies',(select jsonb_agg(to_jsonb(p) order by to_jsonb(p)::text) from pg_policies p where schemaname in ('public','storage')),
 'functions',(select jsonb_agg(v order by v::text) from (select jsonb_build_array(n.nspname,p.proname,pg_get_functiondef(p.oid),p.proacl::text,pg_get_userbyid(p.proowner)) v from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname in ('public','auth','dmf_private')) s),
 'constraints',(select jsonb_agg(v order by v::text) from (select jsonb_build_array(n.nspname,c.relname,k.conname,pg_get_constraintdef(k.oid)) v from pg_constraint k join pg_class c on c.oid=k.conrelid join pg_namespace n on n.oid=c.relnamespace where n.nspname in ('public','auth','storage')) s),
 'triggers',(select jsonb_agg(v order by v::text) from (select jsonb_build_array(n.nspname,c.relname,pg_get_triggerdef(t.oid)) v from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_namespace n on n.oid=c.relnamespace where not t.tgisinternal and n.nspname='public') s)
 )::text;`
  );
}

export async function drill({ output } = {}) {
  const started = Date.now();
  const cluster = await createCluster();
  try {
    const source = localConnection(cluster, "dmf_drill_source");
    await psql(
      localConnection(cluster, "postgres"),
      "create database dmf_drill_source template template0;"
    );
    const snapshot = JSON.parse(
      await fs.readFile(
        new URL("../../tests/fixtures/backup-production-schema.json", import.meta.url),
        "utf8"
      )
    );
    const rendered = renderSchema(snapshot);
    await psql(source, rendered.sql);
    await psql(source, seed);
    const objects = path.join(cluster.root, "synthetic-objects");
    await fs.mkdir(path.join(objects, "nested"), { recursive: true, mode: 0o700 });
    await writePrivate(
      path.join(objects, "nested/example.bin"),
      Buffer.from([0, 255, 1, 2, 13, 10, 128, 42])
    );
    await writePrivate(path.join(objects, "empty.txt"), "");
    const before = await permissions(source);
    const backup = await capture(source, {
      output,
      objectSource: objects,
      kind: "synthetic-drill",
    });
    const sourceContent = await content(source, backup.manifest.tables);
    // Prove the archive is independent of later source writes.
    await psql(source, "update public.leads set notes='Changed after capture';");
    await assert.rejects(restoreLocal(cluster, backup, "MISSING_ACKNOWLEDGEMENT"));
    const manifestPath = path.join(backup.dir, "manifest.json");
    const approvedManifest = await fs.readFile(manifestPath);
    await fs.writeFile(
      manifestPath,
      JSON.stringify({ ...backup.manifest, createdAt: "2000-01-01T00:00:00.000Z" })
    );
    await assert.rejects(restoreLocal(cluster, backup, "RESTORE_SYNTHETIC_EPHEMERAL_ONLY"));
    await fs.writeFile(manifestPath, approvedManifest);
    const target = await restoreLocal(cluster, backup, "RESTORE_SYNTHETIC_EPHEMERAL_ONLY");
    assert.deepEqual(await content(target, backup.manifest.tables), sourceContent);
    assert.equal(await permissions(target), before);
    for (const t of backup.manifest.tables)
      assert.equal(
        (await psql(target, `select count(*) from ${quote(t.schema)}.${quote(t.name)};`)).trim(),
        t.rows
      );
    const restoredObjects = path.join(cluster.root, "restored-objects");
    assert.deepEqual(
      await copyObjects(path.join(backup.dir, "objects"), restoredObjects),
      backup.manifest.objects
    );
    const metadata = JSON.parse(
      await psql(
        target,
        `select json_agg(v order by path) from (select name as path,(metadata->>'size')::integer as bytes from storage.objects where bucket_id='synthetic-private') v;`
      )
    );
    assert.deepEqual(
      metadata,
      backup.manifest.objects.map(({ path, bytes }) => ({ path, bytes }))
    );
    await assert.rejects(psql(target, "set role anon; select * from public.intake_submissions;"));
    assert.equal(
      (
        await psql(
          target,
          "set role authenticated; select count(*) from public.notification_deliveries;"
        )
      ).trim(),
      "0"
    );
    await assert.rejects(
      psql(
        target,
        "insert into public.notification_deliveries(submission_id,channel) values ('ffffffff-ffff-4fff-8fff-ffffffffffff','email');"
      )
    );
    assert.equal(
      (
        await psql(
          target,
          `select public.dmf_receive_intake('30000000-0000-4000-8000-000000000001','contact','{"name":"Synthetic Contact","email":"contact@example.invalid","message":"Local recovery drill only","campaign":{"source":"drill"}}')->>'duplicate';`
        )
      ).trim(),
      "true"
    );
    await psql(
      target,
      `select public.dmf_receive_intake('30000000-0000-4000-8000-000000000004','lead','{"email":"after-restore@example.invalid"}');`
    );
    assert.equal(
      (
        await psql(
          target,
          "select count(*) from public.notification_deliveries where submission_id='30000000-0000-4000-8000-000000000004';"
        )
      ).trim(),
      "2"
    );
    await assert.rejects(restoreLocal(cluster, backup, "RESTORE_SYNTHETIC_EPHEMERAL_ONLY")); // no overwrite
    await verify(backup.dir);
    const evidence = {
      completedAt: new Date().toISOString(),
      status: "PASS",
      durationMs: Date.now() - started,
      snapshotAt: backup.manifest.snapshotAt,
      backupDirectory: backup.dir,
      serverVersion: backup.manifest.serverVersion,
      toolVersions: backup.manifest.toolVersions,
      fixtureSha256: sha256(
        await fs.readFile(
          new URL("../../tests/fixtures/backup-production-schema.json", import.meta.url)
        )
      ),
      tables: backup.manifest.tables,
      rowContentSha256: sourceContent,
      permissionCatalogSha256: sha256(before),
      objectFiles: backup.manifest.objects,
      assertions: [
        "all table counts and row content match captured snapshot",
        "source mutation after capture does not enter restored database",
        "schemas, views, indexes, column types/defaults, ACL, owner, grants, RLS, policies, functions, constraints and triggers match",
        "anon intake access denied; authenticated notification rows hidden by RLS",
        "notification foreign key rejects orphan",
        "intake idempotency and new intake notification creation work after restore",
        "object bytes including binary and empty files match hashes, private permissions and storage metadata inventory",
        "missing acknowledgement, changed approved manifest and existing restore database rejected",
      ],
      limitations: [
        "Synthetic rows only; metadata fixture is not a current production backup.",
        "Auth and Storage are local SQL stubs, not Supabase platform recovery.",
        "Archive and manifest checksums do not authenticate an untrusted archive.",
        `Fixture omitted ${rendered.ignoredPlatformGrants} platform table grants and ${rendered.ignoredPlatformColumnGrants} platform column grants; update_modified_column function body is approximated.`,
        "No production access, secrets retrieval, external messages, object service requests, or live writes performed.",
      ],
    };
    // Evidence is outside the backup payload so manifest verification remains strict.
    return evidence;
  } finally {
    await closeCluster(cluster);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.length !== 1 || args[0] !== "--ack=LOCAL_SYNTHETIC_DRILL") throw new Error("Usage");
    const evidence = await drill();
    writeOutput(JSON.stringify(evidence, null, 2));
  } catch {
    console.error(
      "Local drill failed. Usage: node scripts/backup/drill.mjs --ack=LOCAL_SYNTHETIC_DRILL. Check PG17 tools; PostgreSQL diagnostics are suppressed for privacy."
    );
    process.exitCode = 1;
  }
}

function writeOutput(value) {
  process.stdout.write(String(value) + "\n");
}
