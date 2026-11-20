begin;

-- ============================================================================
-- 1. STUDENT INVITE CODES (Mã Học Viên DMF để mở khoá AI)
-- ============================================================================
create table if not exists public.student_invite_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (length(btrim(code)) between 4 and 40),
  description text,
  program_track text check (program_track in ('azubi', 'skilled', 'studium', 'seasonal')),
  max_uses integer not null default 1 check (max_uses >= 1),
  used_count integer not null default 0 check (used_count >= 0),
  is_active boolean not null default true,
  expires_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.student_invite_codes enable row level security;
revoke all on public.student_invite_codes from public, anon, authenticated;
grant select, insert, update, delete on public.student_invite_codes to authenticated;
grant all on public.student_invite_codes to service_role;

create policy dmf_invite_codes_admin_boundary on public.student_invite_codes as restrictive
  for all to authenticated
  using ((select public.dmf_is_admin()))
  with check ((select public.dmf_is_admin()));

create policy dmf_invite_codes_admin_manage on public.student_invite_codes
  for all to authenticated
  using ((select public.dmf_is_admin()))
  with check ((select public.dmf_is_admin()));

-- ============================================================================
-- 2. STUDENT PROFILES (Hồ sơ Cổng Học Viên & Lớp đệm Staged Sync)
-- ============================================================================
create table if not exists public.student_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  candidate_id uuid references public.candidates(id) on delete set null,

  -- Chương trình & Quyền AI
  program_track text not null default 'azubi' check (program_track in ('azubi', 'skilled', 'studium', 'seasonal')),
  ai_enabled boolean not null default false,
  invite_code_used text,

  -- Thông tin cá nhân chuẩn Hộ chiếu & DIN 5008
  full_name text not null default '',
  given_name text not null default '',
  family_name text not null default '',
  email text not null default '',
  phone text not null default '',
  date_of_birth date,
  place_of_birth text not null default '',
  nationality text not null default 'Vietnamesisch',
  marital_status text not null default 'Ledig',
  passport_number text not null default '',
  passport_expiry date,
  address_street text not null default '',
  address_city text not null default '',
  address_country text not null default 'Vietnam',
  avatar_url text,

  -- Định hướng nghề nghiệp & Trình độ
  target_profession text not null default '',
  experience_years integer not null default 0 check (experience_years between 0 and 50),
  german_level text not null default 'B1' check (german_level in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),

  -- Dữ liệu Tabellarischer Lebenslauf (JSONB)
  education_history jsonb not null default '[]'::jsonb,
  work_experience jsonb not null default '[]'::jsonb,
  language_skills jsonb not null default '[]'::jsonb,
  special_skills jsonb not null default '{}'::jsonb,

  -- Dữ liệu Vorstellungsgespräch & Video
  video_url text,
  interview_script_de text not null default '',
  interview_qa jsonb not null default '[]'::jsonb,

  -- Chữ ký điện tử (Unterschrift) & Pháp lý (DSGVO / Vollmacht §81a)
  signature_data_url text,
  signature_place text not null default 'Ho-Chi-Minh-Stadt',
  signature_updated_at timestamptz,
  dsgvo_consent_accepted boolean not null default false,
  dsgvo_consent_signed_at timestamptz,
  vollmacht_accepted boolean not null default false,
  vollmacht_signed_at timestamptz,
  vollmacht_employer_name text not null default '',

  -- Trạng thái kiểm duyệt & Staged Sync sang bảng candidates
  sync_status text not null default 'draft' check (sync_status in ('draft', 'submitted', 'approved', 'needs_revision')),
  admin_feedback text,
  last_synced_at timestamptz,
  last_synced_by uuid references auth.users(id) on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists student_profiles_user_id_idx on public.student_profiles(user_id);
create index if not exists student_profiles_candidate_id_idx on public.student_profiles(candidate_id);
create index if not exists student_profiles_email_idx on public.student_profiles(lower(email));

alter table public.student_profiles enable row level security;
revoke all on public.student_profiles from public, anon, authenticated;
grant select, insert, update, delete on public.student_profiles to authenticated;
grant all on public.student_profiles to service_role;

create policy dmf_student_profiles_boundary on public.student_profiles as restrictive
  for all to authenticated
  using (user_id = auth.uid() or (select public.dmf_is_admin()))
  with check (user_id = auth.uid() or (select public.dmf_is_admin()));

create policy dmf_student_profiles_access on public.student_profiles
  for all to authenticated
  using (user_id = auth.uid() or (select public.dmf_is_admin()))
  with check (user_id = auth.uid() or (select public.dmf_is_admin()));

-- Prevent non-admin users from forging ai_enabled or sync approval fields
create or replace function public.dmf_guard_student_profile() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at := clock_timestamp();
  if not public.dmf_is_admin() then
    if TG_OP = 'INSERT' then
      new.user_id := auth.uid();
      new.ai_enabled := false;
      new.sync_status := 'draft';
      new.last_synced_at := null;
      new.last_synced_by := null;
    elsif TG_OP = 'UPDATE' then
      new.user_id := old.user_id;
      new.ai_enabled := old.ai_enabled;
      new.invite_code_used := old.invite_code_used;
      new.candidate_id := old.candidate_id;
      new.last_synced_at := old.last_synced_at;
      new.last_synced_by := old.last_synced_by;
      new.admin_feedback := old.admin_feedback;
      if new.sync_status not in ('draft', 'submitted') then
        new.sync_status := old.sync_status;
      end if;
    end if;
  end if;
  return new;
end;
$$;

revoke all on function public.dmf_guard_student_profile() from public, anon, authenticated;
create trigger dmf_student_profile_guard before insert or update on public.student_profiles
  for each row execute function public.dmf_guard_student_profile();

-- ============================================================================
-- 3. STUDENT DOCUMENTS (Kho Giấy Tờ: Bản gốc & Bản dịch công chứng + OCR)
-- ============================================================================
create table if not exists public.student_documents (
  id uuid primary key default gen_random_uuid(),
  student_profile_id uuid not null references public.student_profiles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  doc_type text not null,
  variant text not null default 'original' check (variant in ('original', 'certified_translation')),
  file_name text not null,
  file_path text not null,
  file_url text,
  file_size integer not null default 0,
  mime_type text not null default 'application/pdf',
  ocr_data jsonb,
  ocr_checked_at timestamptz,
  status text not null default 'pending' check (status in ('pending', 'verified', 'rejected')),
  reviewer_note text,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_profile_id, doc_type, variant)
);

create index if not exists student_documents_profile_idx on public.student_documents(student_profile_id);

alter table public.student_documents enable row level security;
revoke all on public.student_documents from public, anon, authenticated;
grant select, insert, update, delete on public.student_documents to authenticated;
grant all on public.student_documents to service_role;

create policy dmf_student_documents_boundary on public.student_documents as restrictive
  for all to authenticated
  using (user_id = auth.uid() or (select public.dmf_is_admin()))
  with check (user_id = auth.uid() or (select public.dmf_is_admin()));

create policy dmf_student_documents_access on public.student_documents
  for all to authenticated
  using (user_id = auth.uid() or (select public.dmf_is_admin()))
  with check (user_id = auth.uid() or (select public.dmf_is_admin()));

-- ============================================================================
-- 4. STUDENT MOTIVATION LETTERS (Đa phiên bản Anschreiben chuẩn DIN 5008)
-- ============================================================================
create table if not exists public.student_motivation_letters (
  id uuid primary key default gen_random_uuid(),
  student_profile_id uuid not null references public.student_profiles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Motivationsschreiben (Standard)',
  is_primary boolean not null default false,
  target_company_name text not null default '',
  target_company_address text not null default '',
  target_city text not null default '',
  target_contact_person text not null default '',
  target_position_de text not null default '',
  prompt_answers jsonb not null default '{}'::jsonb,
  subject_de text not null default '',
  salutation_de text not null default 'Sehr geehrte Damen und Herren,',
  body_de text not null default '',
  closing_de text not null default 'Mit freundlichen Grüßen',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists student_motivation_letters_profile_idx on public.student_motivation_letters(student_profile_id);

alter table public.student_motivation_letters enable row level security;
revoke all on public.student_motivation_letters from public, anon, authenticated;
grant select, insert, update, delete on public.student_motivation_letters to authenticated;
grant all on public.student_motivation_letters to service_role;

create policy dmf_student_letters_boundary on public.student_motivation_letters as restrictive
  for all to authenticated
  using (user_id = auth.uid() or (select public.dmf_is_admin()))
  with check (user_id = auth.uid() or (select public.dmf_is_admin()));

create policy dmf_student_letters_access on public.student_motivation_letters
  for all to authenticated
  using (user_id = auth.uid() or (select public.dmf_is_admin()))
  with check (user_id = auth.uid() or (select public.dmf_is_admin()));

-- ============================================================================
-- 5. SECURE RPC FOR REDEEMING STUDENT INVITE CODE
-- ============================================================================
create or replace function public.dmf_redeem_student_code(p_code text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_code_row public.student_invite_codes%rowtype;
  v_clean_code text := upper(btrim(coalesce(p_code, '')));
begin
  if v_uid is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if length(v_clean_code) < 4 then
    return jsonb_build_object('success', false, 'error', 'Mã học viên không hợp lệ.');
  end if;

  select * into v_code_row
  from public.student_invite_codes
  where upper(btrim(code)) = v_clean_code
    and is_active = true
    and (expires_at is null or expires_at > now())
    and used_count < max_uses
  for update;

  if not found then
    return jsonb_build_object('success', false, 'error', 'Mã học viên không tồn tại, đã hết lượt hoặc hết hạn.');
  end if;

  update public.student_invite_codes
  set used_count = used_count + 1, updated_at = now()
  where id = v_code_row.id;

  update public.student_profiles
  set ai_enabled = true,
      invite_code_used = v_code_row.code,
      program_track = coalesce(v_code_row.program_track, program_track),
      updated_at = now()
  where user_id = v_uid;

  return jsonb_build_object('success', true, 'code', v_code_row.code);
end;
$$;

revoke all on function public.dmf_redeem_student_code(text) from public, anon;
grant execute on function public.dmf_redeem_student_code(text) to authenticated;

commit;
