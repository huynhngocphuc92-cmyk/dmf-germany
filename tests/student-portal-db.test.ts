import { PGlite } from "@electric-sql/pglite";
import { readFile } from "node:fs/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

let db: PGlite;
const adminId = "00000000-0000-4000-8000-000000000001";
const studentA = "00000000-0000-4000-8000-000000000011";
const studentB = "00000000-0000-4000-8000-000000000022";
const anonAuthId = "00000000-0000-4000-8000-000000000099";

async function asRole(role: "anon" | "authenticated" | "postgres", id = "") {
  await db.exec("reset role");
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [id]);
  if (role !== "postgres") await db.exec(`set role ${role}`);
}

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    create role anon;
    create role authenticated;
    create role service_role bypassrls;
    create schema auth;
    create table auth.users (
      id uuid primary key,
      raw_app_meta_data jsonb,
      is_anonymous boolean default false
    );
    create function auth.uid() returns uuid language sql as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
    $$;
    insert into auth.users values
      ('${adminId}', '{"role":"admin"}', false),
      ('${studentA}', '{}', false),
      ('${studentB}', '{}', false),
      ('${anonAuthId}', '{}', true);
    create table public.candidates (
      id uuid default gen_random_uuid() primary key,
      full_name text not null,
      profession text not null,
      experience_years integer default 0,
      german_level text default 'A2',
      avatar_url text,
      visa_status boolean default false,
      is_featured boolean default false,
      created_at timestamptz default now(),
      email text,
      phone text,
      date_of_birth date,
      category text,
      notes text,
      updated_at timestamptz default now(),
      video_url text
    );
    grant usage on schema public to anon, authenticated, service_role;
    grant usage on schema auth to anon, authenticated, service_role;
    grant execute on function auth.uid() to anon, authenticated, service_role;
    create function public.update_modified_column() returns trigger language plpgsql as $$
      begin return new; end
    $$;
  `);
  await db.exec(await readFile("supabase/migrations/20240201_chatbot_tables.sql", "utf8"));
  await db.exec(await readFile("supabase/migrations/202609290001_safe_public_intake.sql", "utf8"));
  await db.exec(
    await readFile("supabase/migrations/202609290002_private_data_policies.sql", "utf8")
  );
  await db.exec(
    await readFile("supabase/migrations/20261031133753_advisory_function_hardening.sql", "utf8")
  );
  await db.exec(
    await readFile(
      "supabase/migrations/20261101072500_student_portal_and_german_dossier.sql",
      "utf8"
    )
  );
}, 30000);

afterAll(async () => {
  await db?.close();
});

describe("student portal Postgres RLS, trigger guard, and invite code RPC", () => {
  it("denies anonymous access to all student portal tables and redeem RPC", async () => {
    await asRole("anon");
    for (const table of [
      "student_invite_codes",
      "student_profiles",
      "student_documents",
      "student_motivation_letters",
    ]) {
      await expect(db.query(`select * from public.${table}`)).rejects.toMatchObject({
        code: "42501",
      });
    }
    await expect(
      db.query("select public.dmf_redeem_student_code('DMF-2026')")
    ).rejects.toMatchObject({ code: "42501" });
  });

  it("blocks direct student privilege escalation while isolating rows per student", async () => {
    await asRole("authenticated", studentA);
    const inserted = await db.query<{
      id: string;
      user_id: string;
      ai_enabled: boolean;
      german_level: string;
      sync_status: string;
    }>(
      `insert into public.student_profiles (user_id, full_name, ai_enabled, sync_status)
       values ($1, 'Nguyen Van A', true, 'approved')
       returning id, user_id, ai_enabled, german_level, sync_status`,
      [studentB]
    );
    // Trigger forces user_id = auth.uid() (studentA), ai_enabled = false, sync_status = 'draft', default german_level = 'A1'
    expect(inserted.rows[0]).toMatchObject({
      user_id: studentA,
      ai_enabled: false,
      german_level: "A1",
      sync_status: "draft",
    });

    // Direct UPDATE attempting to forge ai_enabled = true or sync_status = 'approved' is neutralized
    const updated = await db.query<{
      ai_enabled: boolean;
      invite_code_used: string | null;
      sync_status: string;
    }>(
      `update public.student_profiles
       set ai_enabled = true, invite_code_used = 'FORGED', sync_status = 'approved'
       where user_id = $1
       returning ai_enabled, invite_code_used, sync_status`,
      [studentA]
    );
    expect(updated.rows[0]).toEqual({
      ai_enabled: false,
      invite_code_used: null,
      sync_status: "draft",
    });

    // Student B cannot see or modify Student A's profile or invite codes
    await asRole("authenticated", studentB);
    expect((await db.query("select * from public.student_profiles")).rows).toHaveLength(0);
    expect((await db.query("select * from public.student_invite_codes")).rows).toHaveLength(0);
  });

  it("persists ai_enabled and invite_code_used when redeeming a valid student invite code (F02 fix)", async () => {
    // Admin creates an invite code with max_uses = 1
    await asRole("authenticated", adminId);
    await db.query(
      `insert into public.student_invite_codes (code, program_track, max_uses, created_by)
       values ('DMF-K14-B1', 'skilled', 1, $1)`,
      [adminId]
    );

    // Anonymous auth user cannot redeem
    await asRole("authenticated", anonAuthId);
    await expect(
      db.query("select public.dmf_redeem_student_code('DMF-K14-B1')")
    ).rejects.toMatchObject({ code: "42501" });

    // Student A redeems code (case-insensitive + trimmed)
    await asRole("authenticated", studentA);
    const redeemRes = await db.query<{ res: { success: boolean; code?: string } }>(
      "select public.dmf_redeem_student_code('  dmf-k14-b1  ') as res"
    );
    expect(redeemRes.rows[0].res).toEqual({
      success: true,
      code: "DMF-K14-B1",
    });

    // Verify student_profiles row actually persisted ai_enabled = true & program_track = 'skilled'
    const profileRes = await db.query<{
      ai_enabled: boolean;
      invite_code_used: string | null;
      program_track: string;
    }>(
      "select ai_enabled, invite_code_used, program_track from public.student_profiles where user_id = $1",
      [studentA]
    );
    expect(profileRes.rows[0]).toEqual({
      ai_enabled: true,
      invite_code_used: "DMF-K14-B1",
      program_track: "skilled",
    });

    // Re-redeeming when already unlocked returns success without consuming more slots
    const repeatRes = await db.query<{
      res: { success: boolean; already_unlocked?: boolean };
    }>("select public.dmf_redeem_student_code('DMF-K14-B1') as res");
    expect(repeatRes.rows[0].res).toMatchObject({
      success: true,
      already_unlocked: true,
    });

    // Student B tries to redeem the exhausted 1-use code -> rejected and AI remains false
    await asRole("authenticated", studentB);
    const exhaustedRes = await db.query<{ res: { success: boolean; error?: string } }>(
      "select public.dmf_redeem_student_code('DMF-K14-B1') as res"
    );
    expect(exhaustedRes.rows[0].res.success).toBe(false);

    const profileB = await db.query<{ ai_enabled: boolean }>(
      "select ai_enabled from public.student_profiles where user_id = $1",
      [studentB]
    );
    expect(profileB.rows[0].ai_enabled).toBe(false);
  });
});
