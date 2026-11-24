import nodemailer, { Transporter } from 'nodemailer';

export interface ExchangeEmailPayload {
  toEmail: string;
  toName: string;
  requestedBookTitle: string;
  senderName: string;
  senderEmail: string;
  senderBooks: Array<{ name: string; author: string }>;
}

let cachedTransporter: Transporter | null = null;

const escapeHtml = (str: string): string =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const getTransporter = async (): Promise<Transporter> => {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const port = Number(process.env.SMTP_PORT) || 587;
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    return cachedTransporter;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('SMTP configuration is missing in production environment');
  }

  const testAccount = await nodemailer.createTestAccount();
  cachedTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return cachedTransporter;
};

export const sendExchangeRequestEmail = async (
  payload: ExchangeEmailPayload,
): Promise<string | false> => {
  const transporter = await getTransporter();

  const safeToName = escapeHtml(payload.toName);
  const safeBookTitle = escapeHtml(payload.requestedBookTitle);
  const safeSenderName = escapeHtml(payload.senderName);
  const safeSenderEmail = escapeHtml(payload.senderEmail);

  const booksListHtml =
    payload.senderBooks.length > 0
      ? `<ul>${payload.senderBooks
          .map(
            (book) =>
              `<li><strong>${escapeHtml(book.name)}</strong> &mdash; ${escapeHtml(book.author)}</li>`,
          )
          .join('')}</ul>`
      : '<p><em>The sender has not listed any books for exchange yet.</em></p>';

  const booksListText =
    payload.senderBooks.length > 0
      ? payload.senderBooks
          .map((book) => `- ${book.name} — ${book.author}`)
          .join('\n')
      : 'The sender has not listed any books for exchange yet.';

  const info = await transporter.sendMail({
    from:
      process.env.SMTP_FROM || '"Book Exchange" <noreply@bookexchange.local>',
    to: payload.toEmail,
    replyTo: payload.senderEmail,
    subject: `Book Exchange Request: "${payload.requestedBookTitle}"`,
    text: [
      `Hello, ${payload.toName}!`,
      '',
      `User ${payload.senderName} (${payload.senderEmail}) would like to exchange books with you for "${payload.requestedBookTitle}".`,
      '',
      "Sender's books available for exchange:",
      booksListText,
    ].join('\n'),
    html: `
      <div style="font-family: sans-serif; line-height: 1.5; color: #222;">
        <h2>Hello, ${safeToName}!</h2>
        <p>
          User <strong>${safeSenderName}</strong> (<a href="mailto:${safeSenderEmail}">${safeSenderEmail}</a>)
          would like to exchange books with you for <strong>"${safeBookTitle}"</strong>.
        </p>
        <h3>Sender's books available for exchange:</h3>
        ${booksListHtml}
      </div>
    `,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log('Exchange email preview URL:', previewUrl);
  }

  return previewUrl;
};


export interface PasswordResetEmailPayload {
  toEmail: string;
  toName: string;
  resetUrl: string;
  resetToken: string;
}

export const sendPasswordResetEmail = async (
  payload: PasswordResetEmailPayload,
): Promise<string | false> => {
  const transporter = await getTransporter();

  const safeToName = escapeHtml(payload.toName);
  const safeResetUrl = escapeHtml(payload.resetUrl);
  const safeToken = escapeHtml(payload.resetToken);

  const info = await transporter.sendMail({
    from:
      process.env.SMTP_FROM || '"BookSwap" <noreply@bookexchange.local>',
    to: payload.toEmail,
    subject: 'BookSwap — Password Reset Request',
    text: [
      `Hello, ${payload.toName}!`,
      '',
      'We received a request to reset your BookSwap password.',
      `Reset link (valid for 15 minutes): ${payload.resetUrl}`,
      '',
      `Or paste this reset code on the page: ${payload.resetToken}`,
    ].join('\n'),
    html: `
      <div style="font-family: sans-serif; line-height: 1.5; color: #222;">
        <h2>Hello, ${safeToName}!</h2>
        <p>We received a request to reset your BookSwap password.</p>
        <p>
          <a href="${safeResetUrl}" style="display:inline-block;padding:10px 18px;background:#1e40af;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;">
            Reset Password
          </a>
        </p>
        <p style="font-size:13px;color:#555;">
          Or paste this token manually (valid for 15 minutes):<br/>
          <code style="background:#f1f5f9;padding:4px 6px;border-radius:4px;word-break:break-all;">${safeToken}</code>
        </p>
      </div>
    `,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log('Password reset email preview URL:', previewUrl);
  }

  return previewUrl;
};
