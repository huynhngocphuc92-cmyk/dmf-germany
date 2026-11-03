"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { isAdminUser } from "@/lib/auth/admin-policy";
import { SITE_URL } from "@/lib/site";

export async function requestPasswordResetAction(formData: FormData): Promise<{
  success: boolean;
  error: string | null;
}> {
  const email = String(formData.get("email") || "").trim();
  if (!email || !email.includes("@")) {
    return {
      success: false,
      error:
        "Bitte geben Sie eine gültige E-Mail-Adresse ein. / Vui lòng nhập địa chỉ Email hợp lệ.",
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${SITE_URL}/auth/callback?next=/auth/reset-password`,
    });

    if (error) {
      return {
        success: false,
        error:
          "Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es später erneut. / Không thể gửi yêu cầu lúc này.",
      };
    }

    return {
      success: true,
      error: null,
    };
  } catch {
    return {
      success: false,
      error: "Ein unerwarteter Fehler ist aufgetreten. / Đã xảy ra lỗi kết nối.",
    };
  }
}

export async function updatePasswordAction(formData: FormData): Promise<{
  success: boolean;
  error: string | null;
  redirectTo?: string;
}> {
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirm_password") || "");

  if (password.length < 8) {
    return {
      success: false,
      error:
        "Das Passwort muss mindestens 8 Zeichen lang sein. / Mật khẩu phải có ít nhất 8 ký tự.",
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      error: "Die Passwörter stimmen nicht überein. / Mật khẩu xác nhận không khớp.",
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.is_anonymous) {
      return {
        success: false,
        error:
          "Ihre Sitzung ist abgelaufen. Bitte fordern Sie einen neuen Link zum Zurücksetzen an. / Phiên đặt lại mật khẩu đã hết hạn.",
      };
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    const isEmployer = user.user_metadata?.account_type === "employer";
    let destination = "/portal";
    if (isAdminUser(user)) {
      destination = "/admin";
    } else if (isEmployer) {
      destination = "/fuer-arbeitgeber/datenraum";
    }

    revalidatePath("/", "layout");
    return {
      success: true,
      error: null,
      redirectTo: destination,
    };
  } catch {
    return {
      success: false,
      error: "Passwort konnte nicht aktualisiert werden. / Không thể cập nhật mật khẩu.",
    };
  }
}
