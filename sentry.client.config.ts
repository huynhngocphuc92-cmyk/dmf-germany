import * as Sentry from "@sentry/nextjs";

const sentryDsn = process.env.SENTRY_DSN;

function isEuSentryDsn(dsn?: string): boolean {
  if (!dsn) {
    return false;
  }

  try {
    return new URL(dsn).hostname.endsWith(".de.sentry.io");
  } catch {
    return false;
  }
}

const replayEnabled =
  process.env.NEXT_PUBLIC_SENTRY_ENABLE_REPLAY === "true" && isEuSentryDsn(sentryDsn);

Sentry.init({
  dsn: sentryDsn,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // Recommend adjusting this value in production: https://docs.sentry.io/platforms/javascript/configuration/sampling/
  tracesSampleRate: 0.1,

  // Setting this option to true will print useful information to the console while setting up Sentry.
  debug: false,

  // Replay is only allowed when the project explicitly opts in and the DSN uses EU data residency.
  replaysOnErrorSampleRate: replayEnabled ? 1.0 : 0,
  replaysSessionSampleRate: replayEnabled ? 0.1 : 0,

  integrations: replayEnabled
    ? [
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ]
    : [],
});
