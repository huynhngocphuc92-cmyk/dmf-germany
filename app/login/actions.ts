"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// ============================================
// LOGIN ACTION
// ============================================

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validate inputs
  if (!email || !password) {
    return { error: "Bitte E-Mail und Passwort eingeben." };
  }

  // Attempt to sign in
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Return user-friendly error messages
    if (error.message === "Invalid login credentials") {
      return { error: "E-Mail oder Passwort ist falsch." };
    }
    if (error.message.includes("Email not confirmed")) {
      return { error: "E-Mail-Adresse wurde noch nicht bestätigt." };
    }
    return { error: error.message };
  }

  // Success - revalidate and redirect
  revalidatePath("/", "layout");
  redirect("/admin");
}

// ============================================
// LOGOUT ACTION
// ============================================

export async function signOut(): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Sign out error:", error);
    // Still redirect to login even on error
  }

  revalidatePath("/", "layout");
  redirect("/login");
}

// ============================================
// GET CURRENT USER (Helper)
// ============================================

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

