import nodemailer, { type Transporter } from "nodemailer";

type MailTransporter = Transporter;

declare global {
  var __dmfMailTransporter: MailTransporter | undefined;
}

function createMailTransporter() {
  const port = Number(process.env.SMTP_PORT) || 587;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
  });
}

export function isSmtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

export function getMailTransporter() {
  if (!isSmtpConfigured()) {
    return null;
  }

  if (!globalThis.__dmfMailTransporter) {
    globalThis.__dmfMailTransporter = createMailTransporter();
  }

  return globalThis.__dmfMailTransporter;
}
