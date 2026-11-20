import { isPreviewDeploy, type EnvMap } from "./runtime";

// Preview may use a separately configured test project, never production data.
export function previewBackendAllowed(env: EnvMap = process.env) {
  if (!isPreviewDeploy(env)) return true;
  return (
    env.INTAKE_TEST_BACKEND === "true" &&
    !!env.NEXT_PUBLIC_SUPABASE_URL &&
    !env.NEXT_PUBLIC_SUPABASE_URL.includes("iihprcuhmilmymlbktpy")
  );
}
