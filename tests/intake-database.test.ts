import { PGlite } from "@electric-sql/pglite";
import { readFile, readdir } from "node:fs/promises";
import { afterAll, beforeAll, expect, it } from "vitest";
let db: PGlite;
const admin = "00000000-0000-4000-8000-000000000001";
const person = "00000000-0000-4000-8000-000000000002";
const profile = "00000000-0000-4000-8000-000000000003";
const anonymousAdmin = "00000000-0000-4000-8000-000000000004";
const payload = {
  name: "Fixture Employer",
  email: "fixture@example.invalid",
  message: "Please contact our company",
  privacy: true,
};
let sequence = 10;
const nextId = () => `10000000-0000-4000-8000-${String(++sequence).padStart(12, "0")}`;
async function role(
  name: "anon" | "authenticated" | "service_role" | "postgres",
  id = "",
  claims: Record<string, unknown> = {}
) {
  await db.exec("reset role");
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [id]);
  await db.query("select set_config('request.jwt.claims',$1,false)", [
    JSON.stringify({ sub: id, ...claims }),
  ]);
  if (name !== "postgres") await db.exec(`set role ${name}`);
}
async function receive(id: string, kind = "contact", data: unknown = payload) {
  return (
    await db.query<{ result: { duplicate: boolean } }>(
      "select public.dmf_receive_intake($1,$2,$3::jsonb) result",
      [id, kind, JSON.stringify(data)]
    )
  ).rows[0].result;
}
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    create role anon;create role authenticated;create role service_role bypassrls;
    -- Supabase defaults grant named roles EXECUTE independently of PUBLIC.
    alter default privileges for role postgres in schema public
      grant execute on functions to anon,authenticated,service_role;
    create schema auth;create schema storage;
    create table auth.users(id uuid primary key,raw_app_meta_data jsonb,is_anonymous boolean default false,email varchar(255),raw_user_meta_data jsonb default '{}');
    create function auth.uid() returns uuid language sql as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
    insert into auth.users(id,raw_app_meta_data,is_anonymous) values('${admin}','{"role":"admin"}',false),('${person}','{}',false);
    insert into auth.users(id,raw_app_meta_data,is_anonymous) values('${anonymousAdmin}','{"role":"admin"}',true);
    update auth.users set raw_user_meta_data='{"role":"admin"}' where id='${person}';
    create table candidates(id uuid primary key default gen_random_uuid(),full_name text,category text,profession text,experience_years integer,german_level text,visa_status boolean,avatar_url text,video_url text,is_featured boolean,created_at timestamptz default now(),updated_at timestamptz default now());
    create table inquiries(id uuid primary key default gen_random_uuid(),created_at timestamptz default now(),email text,phone text,message text,status text,type text,client_name text);
    create table posts(id uuid primary key default gen_random_uuid(),status text,slug text unique,published_at timestamptz);
    create table site_config(id uuid primary key default gen_random_uuid());
    create table site_assets(id uuid primary key default gen_random_uuid());
    create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text);
    alter table storage.objects enable row level security;
    create policy legacy_storage on storage.objects for all to authenticated using(true) with check(true);
    create policy legacy_public_images on storage.objects for select using(bucket_id='images');
    grant usage on schema public,auth,storage to anon,authenticated,service_role;
    grant all on all tables in schema public,storage to anon,authenticated,service_role;
    grant select(email),insert(email) on inquiries to anon;
    insert into candidates(id,full_name,profession,is_featured) values('${profile}','Private name','Elektriker',true);
    insert into posts(status) values('published'),('draft');
    create policy legacy_blog_public on posts for select using(status='published');
    create policy legacy_blog_signed_in on posts for all to authenticated using(true) with check(true);
    create policy legacy_config_read on site_config for select using(true);
    create policy legacy_asset_read on site_assets for select using(true);
    insert into storage.objects(bucket_id) values('images'),('candidates');
    insert into site_assets default values;
    -- Live legacy function and attachment, absent from checked-in schema migrations.
    create function public.update_modified_column() returns trigger
      language plpgsql security invoker as $$
      BEGIN NEW.updated_at = now(); RETURN NEW; END;
    $$;
    create trigger zz_fixture_updated_at before update on public.candidates
      for each row execute function public.update_modified_column();
    create schema hostile;
    grant usage on schema hostile to authenticated;
    create function hostile.now() returns timestamptz language sql as $$
      select '2000-01-01'::timestamptz
    $$;
  `);
  for (const name of [
    "20240201_chatbot_tables.sql",
    "202609290001_safe_public_intake.sql",
    "202609290002_private_data_policies.sql",
    "20260929100707_reliable_intake.sql",
    "20260929100708_admin_data_boundaries.sql",
    "20260929100748_server_only_intake_cutover.sql",
    "20260929111530_publication_and_blog_urls.sql",
    "20260929115942_employer_request_workflow.sql",
  ])
    await db.exec(await readFile(`supabase/migrations/${name}`, "utf8"));
  // PUBLIC's earlier revoke leaves Supabase's explicit anon grant intact.
  await role("anon");
  expect((await db.query("select public.dmf_is_admin() admin")).rows).toEqual([{ admin: false }]);
  await role("postgres");
  expect(
    (
      await db.query(`select exists (
      select 1 from pg_proc p, lateral aclexplode(p.proacl) a
      where p.oid='public.dmf_is_admin()'::regprocedure and a.grantee=0
        and a.privilege_type='EXECUTE'
    ) public_execute`)
    ).rows
  ).toEqual([{ public_execute: false }]);
  const definitions = async () =>
    (
      await db.query(`select p.oid::regprocedure::text signature,p.prosrc,p.proowner,
      p.prosecdef,p.provolatile,p.prolang
      from pg_proc p where p.oid in ('public.dmf_is_admin()'::regprocedure,
        'public.update_modified_column()'::regprocedure) order by signature`)
    ).rows;
  const originalDefinitions = await definitions();
  const hardeningMigrations = (await readdir("supabase/migrations")).filter((name) =>
    name.endsWith("_advisory_function_hardening.sql")
  );
  expect(hardeningMigrations).toHaveLength(1);
  const migration = await readFile(`supabase/migrations/${hardeningMigrations[0]}`, "utf8");
  await db.exec(migration);
  expect(await definitions()).toEqual(originalDefinitions);
  const configuration = async () =>
    (
      await db.query(`select p.oid::regprocedure::text signature,p.proconfig,p.proacl::text
      from pg_proc p where p.oid in ('public.dmf_is_admin()'::regprocedure,
        'public.update_modified_column()'::regprocedure) order by signature`)
    ).rows;
  const hardenedConfiguration = await configuration();
  await db.exec(migration);
  expect(await configuration()).toEqual(hardenedConfiguration);
  expect(await definitions()).toEqual(originalDefinitions);
  await role("authenticated", admin);
  await db.query(
    "update candidates set publication_status='published',publication_valid_until=current_date+30,publication_consent_note='Fixture consent documented' where id=$1",
    [profile]
  );
}, 30000);
afterAll(async () => {
  await db?.close();
});

it("removes only anonymous helper execution and preserves public reads and trusted callers", async () => {
  await role("anon");
  await expect(db.query("select public.dmf_is_admin()")).rejects.toMatchObject({ code: "42501" });
  expect((await db.query("select id from candidates")).rows).toEqual([{ id: profile }]);
  expect((await db.query("select status from posts")).rows).toEqual([{ status: "published" }]);
  expect((await db.query("select id from site_assets")).rows).toHaveLength(1);
  await role("postgres");
  expect(
    (
      await db.query(`select
      has_function_privilege('anon','public.dmf_is_admin()','EXECUTE') anon,
      has_function_privilege('authenticated','public.dmf_is_admin()','EXECUTE') authenticated,
      has_function_privilege('service_role','public.dmf_is_admin()','EXECUTE') service_role,
      has_function_privilege('anon','public.update_modified_column()','EXECUTE') trigger_execute,
      has_function_privilege('anon','dmf_private.request_assignees()','EXECUTE') anon_directory,
      has_function_privilege('authenticated','dmf_private.request_assignees()','EXECUTE') authenticated_directory,
      has_function_privilege('authenticated','public.dmf_review_candidate()','EXECUTE') review_execute`)
    ).rows
  ).toEqual([
    {
      anon: false,
      authenticated: true,
      service_role: true,
      trigger_execute: true,
      anon_directory: false,
      authenticated_directory: true,
      review_execute: false,
    },
  ]);
  // A role with no named grant proves the timestamp trigger retains PUBLIC EXECUTE.
  await role("postgres");
  await db.exec("create role fixture_ungranted");
  expect(
    (
      await db.query(`select
      has_function_privilege('fixture_ungranted','public.update_modified_column()','EXECUTE') trigger_execute,
      has_function_privilege('fixture_ungranted','public.dmf_is_admin()','EXECUTE') helper_execute`)
    ).rows
  ).toEqual([{ trigger_execute: true, helper_execute: false }]);
  await role("service_role", admin);
  expect((await db.query("select public.dmf_is_admin() admin")).rows).toEqual([{ admin: true }]);
  await role("authenticated", admin, { app_metadata: {}, user_metadata: {} });
  await expect(db.query("select * from auth.users")).rejects.toMatchObject({ code: "42501" });
  expect((await db.query("select public.dmf_is_admin() admin")).rows).toEqual([{ admin: true }]);
  expect((await db.query("select id from public.dmf_request_assignees()")).rows).toEqual([
    { id: admin },
  ]);
});

it("enforces private RLS for ordinary, metadata-spoofing and anonymous authenticated users", async () => {
  await role("service_role");
  await receive(nextId());
  await receive(nextId(), "lead", { email: "boundary@example.invalid" });
  await role("postgres");
  await db.query("insert into chat_sessions(session_id,messages) values('boundary','[]')");
  const privateTables = ["candidates", "inquiries", "leads", "chat_sessions"];
  // Nonempty fixtures ensure empty results below prove filtering, rather than missing data.
  for (const table of privateTables)
    expect((await db.query(`select id from ${table}`)).rows.length).toBeGreaterThan(0);
  for (const [id, claims] of [
    [person, {}],
    [person, { user_metadata: { role: "admin" }, app_metadata: { role: "admin" } }],
    [anonymousAdmin, { is_anonymous: true, app_metadata: { role: "admin" } }],
  ] as const) {
    await role("authenticated", id, claims);
    expect((await db.query("select public.dmf_is_admin() admin")).rows).toEqual([{ admin: false }]);
    for (const table of [...privateTables, "intake_submissions", "notification_deliveries"])
      expect((await db.query(`select * from ${table}`)).rows).toHaveLength(0);
    for (const table of privateTables) {
      expect((await db.query(`update ${table} set id=id returning id`)).rows).toHaveLength(0);
      expect((await db.query(`delete from ${table} returning id`)).rows).toHaveLength(0);
    }
    for (const sql of [
      "insert into candidates(full_name,profession) values('Fixture person','Pflege')",
      "insert into inquiries(email) values('denied@example.invalid')",
      "insert into leads(email) values('denied@example.invalid')",
      "insert into chat_sessions(session_id,messages) values('denied','[]')",
      "insert into site_assets default values",
    ])
      await expect(db.query(sql)).rejects.toMatchObject({ code: "42501" });
  }
  await role("authenticated", admin, { app_metadata: {} });
  for (const table of privateTables)
    expect((await db.query(`select id from ${table}`)).rows.length).toBeGreaterThan(0);
  expect(
    (await db.query("update leads set notes='Trusted database admin' returning id")).rows.length
  ).toBeGreaterThan(0);
});

it("honors current database admin revocation despite a stale admin JWT", async () => {
  const staleClaims = { app_metadata: { role: "admin" } };
  await role("authenticated", admin, staleClaims);
  expect((await db.query("select public.dmf_is_admin() admin")).rows).toEqual([{ admin: true }]);
  await role("postgres");
  await db.query("update auth.users set raw_app_meta_data='{}' where id=$1", [admin]);
  try {
    await role("authenticated", admin, staleClaims);
    expect((await db.query("select public.dmf_is_admin() admin")).rows).toEqual([{ admin: false }]);
    for (const table of ["candidates", "inquiries", "leads", "chat_sessions"]) {
      expect((await db.query(`select * from ${table}`)).rows).toHaveLength(0);
      expect((await db.query(`update ${table} set id=id returning id`)).rows).toHaveLength(0);
    }
    await expect(
      db.query("insert into leads(email) values('revoked@example.invalid')")
    ).rejects.toMatchObject({ code: "42501" });
    await expect(db.query("select * from public.dmf_request_assignees()")).rejects.toMatchObject({
      code: "42501",
    });
  } finally {
    await role("postgres");
    await db.query(`update auth.users set raw_app_meta_data='{"role":"admin"}' where id=$1`, [
      admin,
    ]);
  }
});

it("keeps the legacy timestamp trigger working with an empty path under a hostile caller path", async () => {
  await role("authenticated", admin);
  await db.exec("set search_path=hostile,public,pg_catalog");
  try {
    expect((await db.query("select now()= '2000-01-01'::timestamptz hijacked")).rows).toEqual([
      { hijacked: true },
    ]);
    expect(
      (
        await db.query(
          `update public.candidates set updated_at='1999-01-01'
      where id=$1 returning updated_at=pg_catalog.now() as timestamp_updated`,
          [profile]
        )
      ).rows
    ).toEqual([{ timestamp_updated: true }]);
    expect(
      (
        await db.query(`select proconfig from pg_proc
      where oid='public.update_modified_column()'::regprocedure`)
      ).rows
    ).toEqual([{ proconfig: ['search_path=""'] }]);
  } finally {
    await db.exec("reset search_path");
  }
});

it("atomically stores one inquiry and one set of notifications across retries", async () => {
  await role("service_role");
  const id = nextId();
  expect(await receive(id)).toEqual({ duplicate: false });
  expect(await receive(id)).toEqual({ duplicate: true });
  expect(
    (
      await db.query(
        "select id from inquiries where id=(select record_id from intake_submissions where id=$1)",
        [id]
      )
    ).rows
  ).toHaveLength(1);
  expect(
    (await db.query("select id from notification_deliveries where submission_id=$1", [id])).rows
  ).toHaveLength(3);
  await expect(
    receive(id, "contact", { ...payload, message: "Different payload" })
  ).rejects.toMatchObject({ code: "23505" });
});
it("rolls back the receipt as well when a profile cannot be accepted", async () => {
  await role("service_role");
  const id = nextId();
  await expect(receive(id, "profile", { ...payload, candidateId: person })).rejects.toMatchObject({
    code: "P0002",
  });
  expect((await db.query("select id from intake_submissions where id=$1", [id])).rows).toHaveLength(
    0
  );
  expect(await receive(id, "profile", { ...payload, candidateId: profile })).toEqual({
    duplicate: false,
  });
  expect(
    (
      await db.query("select candidate_id,candidate_code from inquiries where candidate_id=$1", [
        profile,
      ])
    ).rows
  ).toEqual([{ candidate_id: profile, candidate_code: profile.slice(0, 8).toUpperCase() }]);
});
it("stores separate intentional lead submissions without overwriting the previous lead", async () => {
  await role("service_role");
  await receive(nextId(), "lead", { email: payload.email, company: "One" });
  await receive(nextId(), "lead", { email: payload.email, company: "Two" });
  expect(
    (
      await db.query("select company from leads where email=$1 order by created_at", [
        payload.email,
      ])
    ).rows
  ).toEqual([{ company: "One" }, { company: "Two" }]);
});
it("leases each delivery once and prevents stale or repeated completion", async () => {
  await role("service_role");
  const id = nextId();
  await receive(id);
  const job = (
    await db.query<{ id: string }>(
      "select id from notification_deliveries where submission_id=$1 limit 1",
      [id]
    )
  ).rows[0];
  const claim = () =>
    db.query<{ job: { attemptToken: string } | null }>("select dmf_claim_notification($1) job", [
      job.id,
    ]);
  const first = (await claim()).rows[0].job!;
  expect(first).toBeTruthy();
  expect((await claim()).rows[0].job).toBeNull();
  expect(
    (
      await db.query<{ ok: boolean }>("select dmf_finish_notification($1,$2,'sent',null) ok", [
        job.id,
        person,
      ])
    ).rows[0].ok
  ).toBe(false);
  await db.query("select dmf_finish_notification($1,$2,'failed','provider_unavailable')", [
    job.id,
    first.attemptToken,
  ]);
  const retry = (await claim()).rows[0].job!;
  expect(retry.attemptToken).not.toBe(first.attemptToken);
  await db.query("select dmf_finish_notification($1,$2,'sent',null)", [job.id, retry.attemptToken]);
  expect((await claim()).rows[0].job).toBeNull();
});
it("uses a durable atomic rate counter and resets it after expiry", async () => {
  await role("service_role");
  const key = "a".repeat(64);
  const hit = async () =>
    (
      await db.query<{ result: { success: boolean; remaining: number } }>(
        "select dmf_check_rate_limit($1,2,60) result",
        [key]
      )
    ).rows[0].result;
  expect(await hit()).toMatchObject({ success: true, remaining: 1 });
  expect(await hit()).toMatchObject({ success: true, remaining: 0 });
  expect(await hit()).toMatchObject({ success: false, remaining: 0 });
  await db.query(
    "update intake_rate_limits set expires_at=now()-interval '1 second' where key=$1",
    [key]
  );
  expect(await hit()).toMatchObject({ success: true, remaining: 1 });
});
it("denies public intake bypasses and private queue reads after cutover", async () => {
  for (const name of ["anon", "authenticated"] as const) {
    await role(name, person);
    for (const sql of [
      "select dmf_receive_intake(gen_random_uuid(),'contact','{}')",
      "select dmf_claim_notification(gen_random_uuid())",
      "select dmf_check_rate_limit(repeat('a',64),10,60)",
      "select dmf_submit_lead('{}')",
      "select dmf_save_chat('test',repeat('a',64),'[]','{}')",
    ])
      await expect(db.query(sql)).rejects.toMatchObject({ code: "42501" });
    if (name === "anon")
      await expect(db.query("select email from inquiries")).rejects.toMatchObject({
        code: "42501",
      });
    if (name === "anon")
      await expect(db.query("select * from notification_deliveries")).rejects.toMatchObject({
        code: "42501",
      });
    else expect((await db.query("select * from notification_deliveries")).rows).toHaveLength(0);
  }
});
it("preserves published blog reads while limiting content and storage mutations to the admin", async () => {
  await role("authenticated", person);
  expect((await db.query("select * from posts")).rows).toHaveLength(1);
  await expect(
    db.query("insert into storage.objects(bucket_id) values('images')")
  ).rejects.toMatchObject({ code: "42501" });
  await expect(db.query("insert into site_config default values")).rejects.toMatchObject({
    code: "42501",
  });
  expect((await db.query("select * from inquiries")).rows).toHaveLength(0);
  await role("authenticated", admin);
  expect((await db.query("select * from inquiries")).rows.length).toBeGreaterThan(0);
  await db.query("insert into storage.objects(bucket_id) values('images')");
  await db.query("insert into site_assets default values");
  expect((await db.query("select * from posts")).rows).toHaveLength(2);
});

it("requires review, hides drafts/expired profiles and preserves private consent evidence", async () => {
  await role("authenticated", admin);
  const draft = nextId();
  await db.query(
    "insert into candidates(id,full_name,profession,is_featured,visa_status) values($1,'Fixture person','Pflege',true,true)",
    [draft]
  );
  await role("anon");
  expect((await db.query("select id from candidates where id=$1", [draft])).rows).toHaveLength(0);
  await expect(db.query("select publication_consent_note from candidates")).rejects.toMatchObject({
    code: "42501",
  });
  await role("authenticated", person);
  expect(
    (
      await db.query(
        "update candidates set publication_status='published' where id=$1 returning id",
        [draft]
      )
    ).rows
  ).toHaveLength(0);
  await role("authenticated", admin);
  await expect(
    db.query(
      "update candidates set publication_status='published',publication_valid_until=current_date+30 where id=$1",
      [draft]
    )
  ).rejects.toMatchObject({ code: "23514" });
  await db.query(
    "update candidates set publication_status='published',publication_valid_until=current_date+30,publication_consent_note='Fixture written consent' where id=$1",
    [draft]
  );
  expect(
    (await db.query("select publication_reviewed_by from candidates where id=$1", [draft])).rows
  ).toEqual([{ publication_reviewed_by: admin }]);
  await db.query("update candidates set is_featured=false where id=$1", [draft]);
  await role("anon");
  expect((await db.query("select id from candidates where id=$1", [draft])).rows).toHaveLength(1);
  await role("service_role");
  expect(await receive(nextId(), "profile", { ...payload, candidateId: draft })).toEqual({
    duplicate: false,
  });
  await role("authenticated", admin);
  const revision = (
    await db.query<{ revision: string }>(
      "select updated_at::text revision from candidates where id=$1",
      [draft]
    )
  ).rows[0].revision;
  await db.query("update candidates set profession='Elektriker' where id=$1", [draft]);
  expect(
    (
      await db.query(
        "update candidates set publication_status='published' where id=$1 and updated_at=$2::timestamptz returning id",
        [draft, revision]
      )
    ).rows
  ).toHaveLength(0);
  expect(
    (await db.query("select publication_status from candidates where id=$1", [draft])).rows
  ).toEqual([{ publication_status: "draft" }]);
  await role("service_role");
  await expect(
    receive(nextId(), "profile", { ...payload, candidateId: draft })
  ).rejects.toMatchObject({ code: "P0002" });
  await role("authenticated", admin);
  await db.query("update candidates set full_name='Test User' where id=$1", [draft]);
  await expect(
    db.query("update candidates set publication_status='published' where id=$1", [draft])
  ).rejects.toMatchObject({ code: "23514" });
  // Model time passing without granting public access or weakening the actual policy.
  await role("postgres");
  await db.exec("alter table candidates disable trigger dmf_candidate_publication_review");
  await db.query(
    "update candidates set full_name='Fixture person',publication_status='published',publication_valid_until=current_date-1 where id=$1",
    [draft]
  );
  await db.exec("alter table candidates enable trigger dmf_candidate_publication_review");
  await role("anon");
  expect((await db.query("select id from candidates where id=$1", [draft])).rows).toHaveLength(0);
  await role("service_role");
  await expect(
    receive(nextId(), "profile", { ...payload, candidateId: draft })
  ).rejects.toMatchObject({ code: "P0002" });
});
it("keeps blog alias history atomic, avoids collisions and hides unpublished targets", async () => {
  await role("authenticated", admin);
  const id = nextId();
  await db.query(
    "insert into posts(id,status,slug,published_at) values($1,'published','original',now())",
    [id]
  );
  await db.query("update posts set slug='second' where id=$1", [id]);
  await db.query("update posts set slug='latest' where id=$1", [id]);
  await role("anon");
  expect(
    (await db.query("select slug,post_id from post_slug_redirects order by slug")).rows
  ).toEqual([
    { slug: "original", post_id: id },
    { slug: "second", post_id: id },
  ]);
  await expect(
    db.query("insert into post_slug_redirects(slug,post_id) values('forged',$1)", [id])
  ).rejects.toMatchObject({ code: "42501" });
  await role("authenticated", admin);
  await expect(
    db.query("insert into posts(status,slug) values('draft','original')")
  ).rejects.toMatchObject({ code: "23505" });
  await db.query("update posts set status='draft' where id=$1", [id]);
  await role("anon");
  expect((await db.query("select slug from post_slug_redirects")).rows).toHaveLength(0);
  await role("authenticated", admin);
  await db.query("update posts set slug='original',status='published' where id=$1", [id]);
  await role("anon");
  expect((await db.query("select slug from post_slug_redirects order by slug")).rows).toEqual([
    { slug: "latest" },
    { slug: "second" },
  ]);
});

it("preserves hiring context and the profile reference through the same durable receipt", async () => {
  await role("service_role");
  const id = nextId();
  const request = {
    ...payload,
    company: "Fixture Works",
    requestPurpose: "hiring",
    service: "skilled",
    headcount: 2,
    location: "Berlin",
    timing: "Nach Absprache",
    sourcePath: "/services/skilled-workers",
    campaign: { source: "fixture", campaign: "autumn" },
    candidateId: profile,
  };
  await receive(id, "profile", request);
  expect(await receive(id, "profile", request)).toEqual({ duplicate: true });
  const row = (
    await db.query(
      "select request_purpose,service,headcount,work_location,start_window,source_path,campaign,candidate_id,workflow_version from inquiries where id=(select record_id from intake_submissions where id=$1)",
      [id]
    )
  ).rows[0];
  expect(row).toMatchObject({
    request_purpose: "hiring",
    service: "skilled",
    headcount: 2,
    work_location: "Berlin",
    start_window: "Nach Absprache",
    source_path: "/services/skilled-workers",
    campaign: request.campaign,
    candidate_id: profile,
    workflow_version: 0,
  });
  await role("authenticated", admin);
  const inbox = (
    await db.query<{ id: string; reference: string; search_text: string }>(
      "select id,reference,search_text from dmf_request_inbox where reference=$1",
      [id]
    )
  ).rows[0];
  expect(inbox.reference).toBe(id);
  expect(inbox.id).not.toBe(id);
  expect(inbox.search_text).toContain(id);
});
it("keeps inbox and admin directory private even when called directly", async () => {
  await role("anon");
  await expect(db.query("select * from dmf_request_inbox")).rejects.toMatchObject({
    code: "42501",
  });
  await expect(db.query("select * from dmf_request_assignees()")).rejects.toMatchObject({
    code: "42501",
  });
  await role("authenticated", person);
  expect((await db.query("select * from dmf_request_inbox")).rows).toHaveLength(0);
  await expect(db.query("select * from dmf_request_assignees()")).rejects.toMatchObject({
    code: "42501",
  });
  await role("authenticated", admin);
  expect((await db.query("select id from dmf_request_assignees()")).rows).toEqual([{ id: admin }]);
});
it("assigns, schedules and notes a request atomically while rejecting stale edits", async () => {
  await role("service_role");
  const submission = nextId();
  await receive(submission);
  const id = (
    await db.query<{ record_id: string }>("select record_id from intake_submissions where id=$1", [
      submission,
    ])
  ).rows[0].record_id;
  await role("authenticated", admin);
  await expect(
    db.query("update inquiries set assigned_to=$1 where id=$2", [person, id])
  ).rejects.toMatchObject({ code: "23514" });
  const saved = await db.query(
    "update inquiries set assigned_to=$1,follow_up_on=current_date+1,next_action='Call employer',notes='Internal fixture only',status='in_progress' where id=$2 and workflow_version=0 returning workflow_version",
    [admin, id]
  );
  expect(saved.rows).toEqual([{ workflow_version: 1 }]);
  expect(
    (
      await db.query(
        "update inquiries set notes='Stale overwrite' where id=$1 and workflow_version=0 returning id",
        [id]
      )
    ).rows
  ).toHaveLength(0);
  expect(
    (
      await db.query(
        "select assigned_to,next_action,notes,stage from dmf_request_inbox where id=$1",
        [id]
      )
    ).rows
  ).toEqual([
    {
      assigned_to: admin,
      next_action: "Call employer",
      notes: "Internal fixture only",
      stage: "active",
    },
  ]);
  await db.query("update inquiries set status='completed' where id=$1", [id]);
  expect(
    (await db.query("select status,stage from dmf_request_inbox where id=$1", [id])).rows
  ).toEqual([{ status: "completed", stage: "closed" }]);
});
it("preserves chat lead statuses and campaign separately from inquiry completion", async () => {
  await role("service_role");
  const id = nextId();
  await receive(id, "lead", {
    email: "chat@example.invalid",
    sourcePath: "/services/azubi",
    campaign: { medium: "email" },
  });
  const record = (
    await db.query<{ record_id: string }>("select record_id from intake_submissions where id=$1", [
      id,
    ])
  ).rows[0].record_id;
  await role("authenticated", admin);
  for (const [status, stage] of [
    ["contacted", "active"],
    ["qualified", "active"],
    ["converted", "closed"],
    ["lost", "closed"],
  ]) {
    await db.query("update leads set status=$1 where id=$2", [status, record]);
    expect(
      (
        await db.query(
          "select status,stage,source_path,campaign from dmf_request_inbox where source='lead' and id=$1",
          [record]
        )
      ).rows[0]
    ).toMatchObject({
      status,
      stage,
      source_path: "/services/azubi",
      campaign: { medium: "email" },
    });
  }
  await role("authenticated", person);
  expect(
    (await db.query("update leads set notes='unauthorized' where id=$1 returning id", [record]))
      .rows
  ).toHaveLength(0);
});
