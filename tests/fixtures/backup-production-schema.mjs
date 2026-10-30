// Schema-only reconstruction from captured catalog metadata; no customer rows.
export const quote = (s) => '"' + s.replaceAll('"', '""') + '"';
export function restore(snapshot) {
  const q = quote,
    relation = (s, n) => `${q(s)}.${q(n)}`;
  const sql = [
    `create role anon; create role authenticated; create role service_role bypassrls;
create schema auth; create schema storage; create schema dmf_private;
create table auth.users(id uuid primary key,email text,raw_app_meta_data jsonb default '{}',raw_user_meta_data jsonb default '{}',is_anonymous boolean default false);
create table auth.sessions(id uuid primary key,user_id uuid references auth.users(id),not_after timestamptz);
create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
create function auth.jwt() returns jsonb language sql stable as $$select coalesce(nullif(current_setting('request.jwt.claims',true),'')::jsonb,'{}'::jsonb)$$;
create function auth.role() returns text language sql stable as $$select coalesce(nullif(current_setting('request.jwt.claim.role',true),''),current_user::text)$$;
create table storage.buckets(id text primary key,name text not null,public boolean default false,file_size_limit bigint,allowed_mime_types text[]);
create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text,owner uuid,owner_id text,metadata jsonb);
alter table storage.objects enable row level security;
grant usage on schema public,auth,storage to anon,authenticated,service_role;
grant usage on schema dmf_private to authenticated;
set check_function_bodies=off;
-- Snapshot has the trigger but omits this dependency's body/ACL. Approximation only.
create function public.update_modified_column() returns trigger language plpgsql as $$begin new.updated_at=now(); return new; end$$;`,
  ];
  for (const t of snapshot.tables.filter((t) => t.kind === "r")) {
    // Generic sequence restoration for nextval defaults (none in this snapshot).
    for (const c of t.columns) {
      const m = c.default?.match(/nextval\('([^']+)'::regclass\)/);
      if (m) sql.push(`create sequence if not exists ${m[1]};`);
    }
    sql.push(
      `create table ${relation(t.schema, t.name)} (${t.columns.map((c) => `${q(c.name)} ${c.type}${c.default ? " default " + c.default : ""}${c.not_null ? " not null" : ""}`).join(",")});`
    );
    for (const c of t.columns) {
      const m = c.default?.match(/nextval\('([^']+)'::regclass\)/);
      if (m)
        sql.push(`alter sequence ${m[1]} owned by ${relation(t.schema, t.name)}.${q(c.name)};`);
    }
  }
  for (const c of [...snapshot.constraints].sort((a, b) => (a.type === "f") - (b.type === "f")))
    sql.push(
      `alter table ${relation(c.schema, c.table)} add constraint ${q(c.name)} ${c.definition}${!c.validated && !c.definition.includes("NOT VALID") ? " not valid" : ""};`
    );
  for (const f of snapshot.functions) sql.push(f.definition + ";");
  for (const t of snapshot.tables.filter((t) => t.kind === "v"))
    sql.push(
      `create view ${relation(t.schema, t.name)}${t.options ? " with (" + t.options.join(",") + ")" : ""} as ${t.view_definition}`
    );
  for (const t of snapshot.tables.filter((t) => t.kind === "r"))
    sql.push(
      `alter table ${relation(t.schema, t.name)} ${t.rls ? "enable" : "disable"} row level security; alter table ${relation(t.schema, t.name)} ${t.force_rls ? "force" : "no force"} row level security;`
    );
  for (const t of snapshot.triggers) sql.push(t.definition + ";");
  for (const p of snapshot.policies)
    sql.push(
      `create policy ${q(p.policyname)} on ${relation(p.schemaname, p.tablename)} as ${p.permissive} for ${p.cmd} to ${p.roles.map(q).join(",")}${p.qual ? " using (" + p.qual + ")" : ""}${p.with_check ? " with check (" + p.with_check + ")" : ""};`
    );
  const exists = (g) =>
    snapshot.tables.some((t) => t.schema === g.table_schema && t.name === g.table_name) ||
    (g.table_schema === "storage" && ["objects", "buckets"].includes(g.table_name));
  for (const g of snapshot.table_grants.filter(exists))
    if (g.grantee !== "postgres")
      sql.push(
        `grant ${g.privilege_type} on ${relation(g.table_schema, g.table_name)} to ${q(g.grantee)}${g.is_grantable === "YES" ? " with grant option" : ""};`
      );
  for (const g of snapshot.column_grants.filter(exists))
    if (g.grantee !== "postgres")
      sql.push(
        `grant ${g.privilege_type} (${q(g.column_name)}) on ${relation(g.table_schema, g.table_name)} to ${q(g.grantee)}${g.is_grantable === "YES" ? " with grant option" : ""};`
      );
  for (const f of snapshot.function_grants) {
    const signature = `${relation(f.schema, f.name)}(${f.arguments})`;
    sql.push(`revoke all on function ${signature} from public,anon,authenticated,service_role;`);
    for (const m of f.acl.matchAll(/(?:\{|,)([^=]*)=X(\*)?\/[^,}]+/g))
      if (m[1] !== "postgres")
        sql.push(
          `grant execute on function ${signature} to ${m[1] ? q(m[1]) : "public"}${m[2] ? " with grant option" : ""};`
        );
  }
  return {
    sql: sql.join("\n"),
    ignoredPlatformGrants: snapshot.table_grants.filter((g) => !exists(g)).length,
    ignoredPlatformColumnGrants: snapshot.column_grants.filter((g) => !exists(g)).length,
  };
}
