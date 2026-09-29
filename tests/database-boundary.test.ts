import { PGlite } from "@electric-sql/pglite";
import { readFile } from "node:fs/promises";
import { afterAll, beforeAll, expect, it } from "vitest";

let db: PGlite;
const adminId = "00000000-0000-4000-8000-000000000001";
const ordinaryId = "00000000-0000-4000-8000-000000000002";
const tokenA = "a".repeat(64);
const tokenB = "b".repeat(64);

async function asRole(role: "anon" | "authenticated" | "postgres", id = "") {
  await db.exec("reset role");
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [id]);
  if (role !== "postgres") await db.exec(`set role ${role}`);
}

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    create role anon; create role authenticated;
    create schema auth;
    create table auth.users (id uuid primary key, raw_app_meta_data jsonb, is_anonymous boolean default false);
    create function auth.uid() returns uuid language sql as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
    $$;
    insert into auth.users values ('${adminId}', '{"role":"admin"}', false), ('${ordinaryId}', '{}', false);
    create table public.candidates (
      id uuid default gen_random_uuid() primary key, full_name text not null, profession text not null,
      experience_years integer default 0, german_level text default 'A2', avatar_url text,
      visa_status boolean default false, is_featured boolean default false, created_at timestamptz default now(),
      email text, phone text, date_of_birth date, category text, notes text,
      updated_at timestamptz default now(), video_url text
    );
  `);
  await db.exec(await readFile("supabase/migrations/20240201_chatbot_tables.sql", "utf8"));
  await db.exec(`
    grant usage on schema public to anon, authenticated;
    grant all on candidates, chat_sessions, leads to anon, authenticated;
    -- Reproduce the observed broad public policies, plus the checked-in authenticated read policies.
    alter table candidates enable row level security;
    create policy legacy_public_candidates on candidates for select using (true);
    create policy legacy_public_chat on chat_sessions for select to anon using (true);
    create policy legacy_public_leads on leads for select to anon using (true);
    insert into candidates (full_name, profession, category, email, is_featured, visa_status)
      values ('Private Name', 'Elektriker', 'skilled', 'private@example.invalid', true, true),
             ('Unpublished Name', 'Elektriker', 'skilled', 'unpublished@example.invalid', false, true);
    insert into chat_sessions (session_id, messages) values ('legacy-session', '[{"content":"legacy"}]');
    insert into leads (email, phone, notes) values ('known@example.invalid', 'original-phone', 'private-note');
  `);
  // Reproduce the original direct-database read before applying either migration.
  await asRole("anon");
  expect((await db.query("select email from candidates")).rows).toHaveLength(2);
  expect((await db.query("select notes from leads")).rows).toHaveLength(1);
  await asRole("postgres");
  await db.exec(await readFile("supabase/migrations/202609290001_safe_public_intake.sql", "utf8"));
  await db.exec(
    await readFile("supabase/migrations/202609290002_private_data_policies.sql", "utf8")
  );
}, 30000);

afterAll(async () => {
  await db?.close();
});

it("denies anonymous private columns and whole-table chat/lead reads", async () => {
  await asRole("anon");
  for (const sql of [
    "select email from candidates",
    "select full_name from candidates",
    "select * from chat_sessions",
    "select * from leads",
  ]) {
    await expect(db.query(sql)).rejects.toMatchObject({ code: "42501" });
  }
  const visible = await db.query("select id, profession from candidates");
  expect(visible.rows).toHaveLength(1);
});

it("denies direct anonymous writes and non-admin authenticated reads/writes", async () => {
  await asRole("anon");
  await expect(db.query("update leads set phone = 'attacker'")).rejects.toMatchObject({
    code: "42501",
  });
  await asRole("authenticated", ordinaryId);
  for (const table of ["candidates", "chat_sessions", "leads"]) {
    expect((await db.query(`select * from ${table}`)).rows).toHaveLength(0);
  }
  expect((await db.query("update leads set phone = 'attacker' returning id")).rows).toHaveLength(0);
  await expect(db.query("truncate leads")).rejects.toMatchObject({ code: "42501" });
});

it("preserves admin reads/updates and honors role revocation without waiting for JWT expiry", async () => {
  await asRole("authenticated", adminId);
  expect((await db.query("select full_name,email from candidates")).rows).toHaveLength(2);
  expect((await db.query("update leads set notes = 'admin-note' returning id")).rows).toHaveLength(
    1
  );
  await asRole("postgres");
  await db.query("update auth.users set raw_app_meta_data = '{}' where id = $1", [adminId]);
  await asRole("authenticated", adminId);
  expect((await db.query("select * from leads")).rows).toHaveLength(0);
  await asRole("postgres");
  await db.query('update auth.users set raw_app_meta_data = \'{"role":"admin"}\' where id = $1', [
    adminId,
  ]);
});

it("binds chat updates to a secret owner token and prevents claiming legacy sessions", async () => {
  await asRole("anon");
  const save = async (session: string, token: string, message: string) => {
    const result = await db.query<{ saved: boolean }>(
      "select public.dmf_save_chat($1, $2, $3::jsonb, '{}'::jsonb) as saved",
      [session, token, JSON.stringify([{ content: message }])]
    );
    return result.rows[0].saved;
  };
  expect(await save("owned-session", tokenA, "first")).toBe(true);
  expect(await save("owned-session", tokenA, "owner-update")).toBe(true);
  expect(await save("owned-session", tokenB, "attacker-update")).toBe(false);
  expect(await save("legacy-session", tokenB, "attacker-update")).toBe(false);
  await asRole("postgres");
  const result = await db.query<{ messages: unknown; owner_token_hash: string }>(
    "select messages,owner_token_hash from chat_sessions where session_id='owned-session'"
  );
  expect(result.rows[0].messages).toEqual([{ content: "owner-update" }]);
  expect(result.rows[0].owner_token_hash).not.toBe(tokenA);
});

it("public lead intake never overwrites an existing lead, with or without a unique email index", async () => {
  await asRole("anon");
  const submit = () =>
    db.query("select public.dmf_submit_lead($1::jsonb)", [
      JSON.stringify({ email: "known@example.invalid", phone: "attacker-phone" }),
    ]);
  await submit(); // Historical repository schema has a unique email index.
  await asRole("postgres");
  expect(
    (await db.query("select phone from leads where email='known@example.invalid'")).rows
  ).toEqual([{ phone: "original-phone" }]);
  await db.exec("drop index leads_email_unique"); // Observed production schema has no email unique index.
  await asRole("anon");
  await submit();
  await asRole("postgres");
  expect(
    (
      await db.query(
        "select phone from leads where email='known@example.invalid' order by created_at"
      )
    ).rows
  ).toEqual([{ phone: "original-phone" }, { phone: "attacker-phone" }]);
});

it("rejects malformed RPC ownership tokens and oversized input at the database boundary", async () => {
  await asRole("anon");
  await expect(
    db.query("select public.dmf_save_chat('invalid', 'short', '[]', '{}')")
  ).rejects.toMatchObject({ code: "22023" });
  await expect(db.query("select public.dmf_submit_lead('{}')")).rejects.toMatchObject({
    code: "22023",
  });
});
