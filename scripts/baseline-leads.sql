-- Baseline lead/tháng cho dmf-talents.de
-- Dán vào Supabase SQL Editor (Dashboard → SQL Editor → New query → Run)
-- Chỉ ĐỌC, không sửa gì. Cho ra số lead mỗi tháng để làm mốc so sánh.

-- 1) Inquiries (form liên hệ + hỏi hồ sơ ứng viên) theo tháng
select to_char(date_trunc('month', created_at), 'YYYY-MM') as thang,
       count(*) as so_luong
from inquiries
group by 1
order by 1 desc
limit 12;

-- 2) Leads (thu từ chatbot) theo tháng
select to_char(date_trunc('month', created_at), 'YYYY-MM') as thang,
       count(*) as so_luong
from leads
group by 1
order by 1 desc
limit 12;

-- 3) Tổng nhanh 2 nguồn
select 'inquiries' as nguon, count(*) as tong from inquiries
union all
select 'leads' as nguon, count(*) as tong from leads;
