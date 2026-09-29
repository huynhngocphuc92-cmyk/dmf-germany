export function validateBuildEnvironment(env: NodeJS.ProcessEnv) {
  const missing = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"].filter(
    (key) => !env[key]
  );
  if (env.VERCEL_ENV === "production" && !env.SUPABASE_SECRET_KEY && !env.SUPABASE_SERVICE_ROLE_KEY)
    missing.push("SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY");
  if (missing.length)
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  const url = new URL(env.NEXT_PUBLIC_SUPABASE_URL!);
  if (
    url.protocol !== "https:" &&
    !(url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname))
  )
    throw new Error("Invalid Supabase URL protocol");
  const publicKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (publicKey.startsWith("sb_secret_"))
    throw new Error("A server secret must never be used as the public Supabase key");
  if (publicKey.split(".").length === 3) {
    let role: string | undefined;
    try {
      role = JSON.parse(Buffer.from(publicKey.split(".")[1], "base64url").toString()).role;
    } catch {
      throw new Error("Invalid public Supabase key");
    }
    if (role !== "anon") throw new Error("The public Supabase key must have the anon role");
  }
}
