import "server-only";
import nodemailer from "nodemailer";
import { emailEnv } from "./env";
import { formatDateNb } from "./format";

/**
 * Transactional e-mail, sent from artrosefysio@gmail.com through Gmail SMTP.
 * Needs GMAIL_USER and GMAIL_APP_PASSWORD (see .env.example). Never throws:
 * a failed e-mail must not undo a purchase, so callers get a result instead.
 */

export type SendResult = { sent: true } | { sent: false; reason: string };

type ViewingLinkEmail = {
  to: string;
  watchUrl: string;
  expiresAt: Date;
  packageTitle: string;
};

export async function sendViewingLinkEmail({ to, watchUrl, expiresAt, packageTitle }: ViewingLinkEmail): Promise<SendResult> {
  const config = emailEnv();
  if (!config) return { sent: false, reason: "E-post er ikke satt opp (GMAIL_USER / GMAIL_APP_PASSWORD mangler)" };

  const validUntil = formatDateNb(expiresAt);

  const text = [
    "Hei!",
    "",
    `Takk for kjøpet av ${packageTitle}.`,
    "",
    "Her er din personlige lenke til treningsvideoene:",
    watchUrl,
    "",
    `Lenken virker til og med ${validUntil}. Du trenger ikke passord eller innlogging — lagre gjerne denne e-posten.`,
    "Lenken er personlig, så ikke del den med andre.",
    "",
    "Har du spørsmål, kan du svare på denne e-posten.",
    "",
    "Vennlig hilsen",
    "Klaus Halbakken",
    "Artrosefysio",
  ].join("\n");

  const html = `<!doctype html>
<html lang="nb">
  <body style="margin:0;padding:24px;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;color:#111;">
    <div style="max-width:560px;margin:0 auto;background:#fff;padding:32px;border-top:4px solid #e8001c;">
      <p style="margin:0 0 16px;">Hei!</p>
      <p style="margin:0 0 16px;">Takk for kjøpet av <strong>${escapeHtml(packageTitle)}</strong>.</p>
      <p style="margin:0 0 24px;">Her er din personlige lenke til treningsvideoene:</p>
      <p style="margin:0 0 24px;">
        <a href="${escapeHtml(watchUrl)}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:14px 24px;font-weight:bold;">Se videoene</a>
      </p>
      <p style="margin:0 0 8px;font-size:13px;color:#555;word-break:break-all;">${escapeHtml(watchUrl)}</p>
      <p style="margin:24px 0 16px;">Lenken virker til og med <strong>${escapeHtml(validUntil)}</strong>. Du trenger ikke passord eller innlogging — lagre gjerne denne e-posten. Lenken er personlig, så ikke del den med andre.</p>
      <p style="margin:0 0 24px;">Har du spørsmål, kan du svare på denne e-posten.</p>
      <p style="margin:0;">Vennlig hilsen<br />Klaus Halbakken<br />Artrosefysio</p>
    </div>
  </body>
</html>`;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: config.GMAIL_USER, pass: config.GMAIL_APP_PASSWORD },
      connectionTimeout: 10_000,
      socketTimeout: 15_000,
    });
    await transporter.sendMail({
      from: `"Artrosefysio" <${config.GMAIL_USER}>`,
      to,
      subject: "Din lenke til treningsvideoene — Artrosefysio",
      text,
      html,
    });
    return { sent: true };
  } catch (error) {
    console.error("[email] sending viewing link failed", error);
    return { sent: false, reason: error instanceof Error ? error.message : String(error) };
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
