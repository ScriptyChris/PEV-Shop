import { config as dotenvConfig } from 'dotenv';
import { createTransport } from 'nodemailer';
import SMTPTransport = require('nodemailer/lib/smtp-transport');
import SendmailTransport = require('nodemailer/lib/sendmail-transport');

dotenvConfig();

const translations = Object.freeze({
  activationSubject: 'Account activation',
  activationMessage: `
    <h1>Welcome to the PEV Shop!</h1>

    <p>Thank you for creating a new account. In order to use it, you have to 
    activate it first by clicking on the following link: 
    <a href="{URL}" target="_blank">{URL}</a></p>
    <p>The above link will expire after 1 hour.</p>
  `.trim(),
  resetPasswordSubject: 'Reset password',
  resetPasswordMessage: `
    <h1>Hello from the PEV Shop!</h1>

    <p>We received your request to reset your account's password. In order to do it, you have to 
    set a new one by clicking on the following link: 
    <a href="{URL}" target="_blank">{URL}</a></p>
    <p>The above link will expire after 1 hour.</p>
  `.trim(),
});
const mailerConfig: SMTPTransport.Options = Object.freeze({
  host: process.env.EMAIL_HOST as string, //'0.0.0.0',
  port: Number(process.env.EMAIL_SMTP_PORT), //1025// 587 // TODO: [ENV] use 465 for HTTPS
});

const EMAIL_TYPES_CONFIG = Object.freeze({
  ACTIVATION: {
    subject: translations.activationSubject,
    getMessage(url: string): string {
      return translations.activationMessage.replace(/{URL}/g, url);
    },
  },
  RESET_PASSWORD: {
    subject: translations.resetPasswordSubject,
    getMessage(url: string): string {
      return translations.resetPasswordMessage.replace(/{URL}/g, url);
    },
  },
} as const);
type emailTypesConfigKeys = keyof typeof EMAIL_TYPES_CONFIG;

export const EMAIL_TYPES = Object.fromEntries(
  Object.entries(EMAIL_TYPES_CONFIG).map(([emailType]) => [emailType, emailType])
) as Record<emailTypesConfigKeys, emailTypesConfigKeys>;

export default async function sendMail(
  receiver: string,
  emailType: emailTypesConfigKeys,
  link: string
): Promise<SendmailTransport.SentMessageInfo> {
  const transporter = createTransport(mailerConfig);
  const mailOptions: Partial<SendmailTransport.Options> = {
    from: process.env.EMAIL_FROM, //'PEV_Shop@example.org',
    to: receiver,
    subject: EMAIL_TYPES_CONFIG[emailType].subject,
    html: EMAIL_TYPES_CONFIG[emailType].getMessage(link),
  };

  return transporter.sendMail(mailOptions);
}
