// Preview may use a separately configured test project, never production data.
export function previewBackendAllowed(env: NodeJS.ProcessEnv = process.env) {
  if (env.VERCEL_ENV !== "preview") return true;
  return (
    env.INTAKE_TEST_BACKEND === "true" &&
    !!env.NEXT_PUBLIC_SUPABASE_URL &&
    !env.NEXT_PUBLIC_SUPABASE_URL.includes("iihprcuhmilmymlbktpy")
  );
}
