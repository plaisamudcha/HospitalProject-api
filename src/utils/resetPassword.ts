/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path';
import nodemailer from 'nodemailer';
import { envConfig } from '../config/config';
import fs from 'fs';
import { HttpError } from './httpError';
import { HttpStatusCode } from '../types/apiType';

const resolveTemplatePath = (filename: string) => {
  const candidates = [
    path.join(process.cwd(), 'src', 'templates', filename),
    path.join(process.cwd(), 'dist', 'templates', filename),
    path.join(process.cwd(), 'templates', filename),
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }

  // If running under CommonJS, __dirname may exist — try relative to this file
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyGlobal: any = globalThis as any;
    if (typeof anyGlobal.__dirname === 'string') {
      const p = path.join(anyGlobal.__dirname, '..', 'templates', filename);
      if (fs.existsSync(p)) return p;
    }
  } catch {
    // ignore
  }

  // Fallback to first candidate (will likely fail later with a readable error)
  return candidates[0];
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: envConfig.EMAIL_USER,
    pass: envConfig.EMAIL_PASS,
  },
});

const sendResetPasswordEmail = async (
  email: string,
  token: string,
): Promise<void> => {
  const filePath = resolveTemplatePath('resetPassword.html');

  let html: string;
  try {
    html = await fs.promises.readFile(filePath, 'utf-8');
  } catch (err: any) {
    throw new HttpError(
      `Failed to load email template: ${err?.message ?? err}`,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
  }

  const baseUrl =
    envConfig.FRONTEND_URL ?? `http://localhost:${envConfig.PORT}`;
  const resetLink = `${baseUrl.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(
    token,
  )}`;

  html = html.replace(/{{RESET_LINK}}/g, resetLink);

  try {
    await transporter.verify();
  } catch (err) {
    console.warn('Email transporter verification failed:', err);
  }

  try {
    await transporter.sendMail({
      from: `"Hospital" <${envConfig.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Password',
      text: `Reset your password using the following link: ${resetLink}`,
      html,
    });
  } catch (err: any) {
    throw new HttpError(
      `Failed to send reset password email: ${err?.message ?? err}`,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
    );
  }
};

export default sendResetPasswordEmail;
