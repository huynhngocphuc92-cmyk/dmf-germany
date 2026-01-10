# Admin Requests Page

Trang quản lý yêu cầu khách hàng (CRM mini).

## Cấu trúc

- `page.tsx` - Server component, fetch data từ Supabase
- `requests-client.tsx` - Client component, hiển thị UI
- `actions.ts` - Server actions để CRUD inquiries
- `types.ts` - TypeScript types và constants

## Route

- URL: `/admin/requests`
- Sidebar link: "Anfragen" / "Yêu cầu"

## Yêu cầu Supabase

Cần tạo bảng `inquiries` trong Supabase với schema:

```sql
CREATE TABLE inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('contact', 'profile')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed')),
  candidate_code TEXT,
  candidate_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at DESC);
```

Nếu bảng chưa tồn tại, trang vẫn hiển thị được với empty state.
