import type { Metadata } from "next";
import { getOrCreateStudentPortalBundle } from "./actions";
import { StudentPortalClient } from "./portal-client";

export const metadata: Metadata = {
  title: "Cổng Học Viên & Chuẩn Hoá Hồ Sơ Đức (Bewerberportal) | DMF Talents",
  description:
    "Nộp giấy tờ, tạo Tabellarischer Lebenslauf, viết Motivationsschreiben chuẩn DIN 5008, luyện Vorstellungsgespräch và ký biểu mẫu DSGVO / §81a AufenthG.",
  robots: { index: false, follow: false },
};

export default async function StudentPortalPage() {
  const bundle = await getOrCreateStudentPortalBundle();

  return (
    <StudentPortalClient
      initialProfile={bundle.profile}
      initialDocuments={bundle.documents}
      initialLetters={bundle.letters}
      isAdmin={bundle.isAdmin}
    />
  );
}
