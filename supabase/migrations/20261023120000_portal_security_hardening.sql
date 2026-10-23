begin;

-- ============================================================================
-- PORTAL SECURITY HARDENING (đợt vá sau đánh giá 23/10/2026)
--
-- 1. student_documents: học viên tự sửa được các cột kết quả kiểm duyệt
--    (status / reviewer_note / reviewed_at / reviewed_by) qua PostgREST vì
--    bảng chưa có trigger guard như student_profiles. Vá bằng trigger:
--    người không phải admin không bao giờ đặt được trạng thái duyệt, trừ
--    việc nộp lại file mới (file_path đổi) thì trạng thái quay về 'pending'.
-- 2. student_documents + student_motivation_letters: policy cũ chỉ kiểm
--    user_id của dòng, không kiểm student_profile_id có thuộc về người gọi
--    hay không -> gắn được giấy tờ/thư giả vào dossier của học viên khác.
--    Vá bằng kiểm tra sở hữu ngay trong trigger INSERT/UPDATE.
-- 3. Bucket 'student-documents' (chứa scan hộ chiếu/bằng cấp + video học
--    viên) chưa từng được tạo bằng migration. Tạo bucket ở chế độ PRIVATE
--    kèm policy: chỉ chủ sở hữu (thư mục portal/<user_id>/...) và admin
--    mới truy cập được. App đọc file qua signed URL (xem lib/portal/storage).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1+2. GUARD CHO STUDENT DOCUMENTS
-- ----------------------------------------------------------------------------
create or replace function public.dmf_guard_student_document() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at := clock_timestamp();
  if not public.dmf_is_admin() then
    if TG_OP = 'INSERT' then
      new.user_id := auth.uid();
      new.status := 'pending';
      new.reviewer_note := null;
      new.reviewed_at := null;
      new.reviewed_by := null;
      if not exists (
        select 1 from public.student_profiles p
        where p.id = new.student_profile_id and p.user_id = auth.uid()
      ) then
        raise exception 'student_profile_id does not belong to the caller'
          using errcode = '42501';
      end if;
    elsif TG_OP = 'UPDATE' then
      new.user_id := old.user_id;
      new.student_profile_id := old.student_profile_id;
      if new.file_path is distinct from old.file_path then
        -- Nộp lại file mới: hồ sơ quay về chờ duyệt, xoá kết quả duyệt cũ.
        new.status := 'pending';
        new.reviewer_note := null;
        new.reviewed_at := null;
        new.reviewed_by := null;
      else
        -- Không đổi file: giữ nguyên toàn bộ kết quả kiểm duyệt của admin.
        new.status := old.status;
        new.reviewer_note := old.reviewer_note;
        new.reviewed_at := old.reviewed_at;
        new.reviewed_by := old.reviewed_by;
      end if;
    end if;
  end if;
  return new;
end;
$$;

revoke all on function public.dmf_guard_student_document() from public, anon, authenticated;
drop trigger if exists dmf_student_document_guard on public.student_documents;
create trigger dmf_student_document_guard before insert or update on public.student_documents
  for each row execute function public.dmf_guard_student_document();

-- ----------------------------------------------------------------------------
-- 2. GUARD CHO STUDENT MOTIVATION LETTERS (chỉ cần khoá quyền sở hữu)
-- ----------------------------------------------------------------------------
create or replace function public.dmf_guard_student_letter() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at := clock_timestamp();
  if not public.dmf_is_admin() then
    if TG_OP = 'INSERT' then
      new.user_id := auth.uid();
      if not exists (
        select 1 from public.student_profiles p
        where p.id = new.student_profile_id and p.user_id = auth.uid()
      ) then
        raise exception 'student_profile_id does not belong to the caller'
          using errcode = '42501';
      end if;
    elsif TG_OP = 'UPDATE' then
      new.user_id := old.user_id;
      new.student_profile_id := old.student_profile_id;
    end if;
  end if;
  return new;
end;
$$;

revoke all on function public.dmf_guard_student_letter() from public, anon, authenticated;
drop trigger if exists dmf_student_letter_guard on public.student_motivation_letters;
create trigger dmf_student_letter_guard before insert or update on public.student_motivation_letters
  for each row execute function public.dmf_guard_student_letter();

-- ----------------------------------------------------------------------------
-- 3. STORAGE BUCKET student-documents — PRIVATE + POLICY THEO CHỦ SỞ HỮU
--    Đường dẫn object có dạng: portal/<user_id>/<tên file>
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('student-documents', 'student-documents', false)
on conflict (id) do nothing;

drop policy if exists dmf_student_documents_storage_owner on storage.objects;
create policy dmf_student_documents_storage_owner on storage.objects
  for all to authenticated
  using (
    bucket_id = 'student-documents'
    and (storage.foldername(name))[1] = 'portal'
    and (storage.foldername(name))[2] = auth.uid()::text
  )
  with check (
    bucket_id = 'student-documents'
    and (storage.foldername(name))[1] = 'portal'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

drop policy if exists dmf_student_documents_storage_admin on storage.objects;
create policy dmf_student_documents_storage_admin on storage.objects
  for all to authenticated
  using (bucket_id = 'student-documents' and (select public.dmf_is_admin()))
  with check (bucket_id = 'student-documents' and (select public.dmf_is_admin()));

commit;
