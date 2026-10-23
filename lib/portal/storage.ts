import "server-only";

/**
 * Bucket `student-documents` là PRIVATE (xem migration
 * 20261023120000_portal_security_hardening.sql) vì chứa scan hộ chiếu,
 * bằng cấp và video của học viên. Mọi đường dẫn hiển thị file phải là
 * signed URL ngắn hạn tạo ở server, không dùng public URL nữa.
 */
export const STUDENT_DOCUMENTS_BUCKET = "student-documents";
const SIGNED_URL_TTL_SECONDS = 3600;

interface SignedUrlClient {
  storage: {
    from(bucket: string): {
      createSignedUrl(
        path: string,
        expiresIn: number
      ): Promise<{ data: { signedUrl: string } | null }>;
    };
  };
}

/** Tạo signed URL cho một object path trong bucket student-documents. */
export async function signStudentFilePath(
  supabase: SignedUrlClient,
  filePath: string | null | undefined,
  expiresIn: number = SIGNED_URL_TTL_SECONDS
): Promise<string | null> {
  if (!filePath) return null;
  const { data } = await supabase.storage
    .from(STUDENT_DOCUMENTS_BUCKET)
    .createSignedUrl(filePath, expiresIn);
  return data?.signedUrl ?? null;
}

/**
 * Trích object path từ URL file đã lưu trước đây (public URL hoặc signed URL
 * của bucket student-documents). Trả null nếu URL không thuộc bucket này
 * (ví dụ link YouTube unlisted do học viên dán tay).
 */
export function studentFilePathFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const marker = `/${STUDENT_DOCUMENTS_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  const path = url.slice(idx + marker.length).split("?")[0];
  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
}

/** Thay file_url của danh sách tài liệu bằng signed URL mới nhất. */
export async function signStudentDocumentUrls<
  T extends { file_path: string; file_url: string | null },
>(supabase: SignedUrlClient, documents: T[]): Promise<T[]> {
  return Promise.all(
    documents.map(async (doc) => {
      const signed = await signStudentFilePath(supabase, doc.file_path);
      return signed ? { ...doc, file_url: signed } : doc;
    })
  );
}

/** Nếu video_url đang trỏ vào bucket student-documents thì ký lại URL. */
export async function signStudentVideoUrl(
  supabase: SignedUrlClient,
  videoUrl: string | null | undefined
): Promise<string | null> {
  const path = studentFilePathFromUrl(videoUrl);
  if (!path) return videoUrl ?? null;
  return (await signStudentFilePath(supabase, path)) ?? videoUrl ?? null;
}
