import nodemailer from "nodemailer";

export type MailAddress = string | { name?: string; address: string };

export interface SendMailOptions {
  from: MailAddress;
  to: MailAddress;
  replyTo?: MailAddress;
  subject: string;
  html: string;
  messageId?: string;
}

export interface MailTransporter {
  sendMail(options: SendMailOptions): Promise<{ accepted?: Array<string | { address: string }> }>;
}

function formatMailAddress(addr: MailAddress): string {
  if (typeof addr === "string") return addr.trim();
  const cleanName = addr.name?.replace(/[\r\n<>"]/g, "").trim();
  return cleanName ? `${cleanName} <${addr.address.trim()}>` : addr.address.trim();
}

function createResendHttpTransporter(apiKey: string): MailTransporter {
  return {
    async sendMail(options) {
      const toAddress =
        typeof options.to === "string" ? options.to.trim() : options.to.address.trim();
      const body: Record<string, unknown> = {
        from: formatMailAddress(options.from),
        to: [formatMailAddress(options.to)],
        subject: options.subject,
        html: options.html,
      };
      if (options.replyTo) body.reply_to = formatMailAddress(options.replyTo);
      if (options.messageId) body.headers = { "Message-ID": options.messageId };

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Resend API delivery failed (${response.status})`);
      }

      return { accepted: [toAddress] };
    },
  };
}

function createPerRequestSmtpTransporter(): MailTransporter {
  const port = Number(process.env.SMTP_PORT) || 587;

  return {
    async sendMail(options) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 20000,
        disableFileAccess: true,
        disableUrlAccess: true,
        pool: false,
      });

      try {
        return await transporter.sendMail(options);
      } finally {
        transporter.close();
      }
    },
  };
}

export function isSmtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

export function getMailTransporter(): MailTransporter | null {
  if (!isSmtpConfigured()) {
    return null;
  }

  if (process.env.SMTP_HOST?.trim().toLowerCase() === "smtp.resend.com") {
    const apiKey = process.env.SMTP_PASSWORD?.trim();
    return apiKey ? createResendHttpTransporter(apiKey) : null;
  }

  // Create per-request non-pooled transport so Workers never share TCP sockets across requests.
  return createPerRequestSmtpTransporter();
}
