#!/bin/sh

set -eu

staged_env_files=$(
  git diff --cached --name-only --diff-filter=ACMR |
    rg '(^|/)\.env(\..+)?$' |
    rg -v '(^|/)\.env\.example$' || true
)

if [ -n "$staged_env_files" ]; then
  echo "Blocked commit: staged environment files detected."
  echo "$staged_env_files"
  echo "Move secrets to your local env only and keep .env.example sanitized."
  exit 1
fi

staged_diff=$(git diff --cached --no-color --unified=0 -- . ':(exclude).env.example')

if printf "%s" "$staged_diff" | rg -n '^\+.*-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----' >/dev/null; then
  echo "Blocked commit: staged diff contains a private key."
  exit 1
fi

if printf "%s" "$staged_diff" |
  rg -n '^\+.*(SUPABASE_SERVICE_ROLE_KEY|SMTP_PASSWORD|GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY|SENTRY_AUTH_TOKEN|ANTHROPIC_API_KEY|GEMINI_API_KEY|VERCEL_OIDC_TOKEN)=' >/dev/null; then
  echo "Blocked commit: staged diff contains high-risk secret assignments."
  exit 1
fi
