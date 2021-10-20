import * as dotenv from 'dotenv';
import { createTransport } from 'nodemailer';
import SMTPTransport = require('nodemailer/lib/smtp-transport');
import getLogger from '../../../utils/logger';

// @ts-ignore
dotenv.config();

const logger = getLogger(module.filename);

const translations = Object.freeze({
  activationSubject: 'Account activation',
  activationMessage: `
    <h1>Welcome to the PEV Shop!</h1>

    <p>Thank you for creating a new account. In order to use it, you have to 
    activate it first by clicking on the following link: 
    <a href="{URL}" target="_blank">{URL}</a></p>
    <p>The above link will expire after 1 hour.</p>
  `.trim(),
});
const mailerConfig: SMTPTransport.Options = Object.freeze({
  host: process.env.EMAIL_HOST as string, //'0.0.0.0',
  port: Number(process.env.EMAIL_PORT), //1025// 587 // TODO: [ENV] use 465 for HTTPS
});

const EMAIL_TYPES_CONFIG = Object.freeze({
  ACTIVATION: {
    subject: translations.activationSubject,
    getMessage(url: string): string {
      return translations.activationMessage.replace(/{URL}/g, url);
    },
  },
} as const);
type emailTypesConfigKeys = keyof typeof EMAIL_TYPES_CONFIG;

export const EMAIL_TYPES = Object
  // @ts-ignore
  .fromEntries(
    (Object.entries(EMAIL_TYPES_CONFIG) as Array<[emailTypesConfigKeys, any]>).map(([emailType]) => [
      emailType,
      emailType,
    ])
  ) as Record<emailTypesConfigKeys, emailTypesConfigKeys>;

export default function sendMail(
  receiver: string,
  emailType: emailTypesConfigKeys,
  link: string
): Promise<SMTPTransport.SentMessageInfo> {
  const transporter = createTransport(mailerConfig);
  const mailOptions = {
    from: process.env.EMAIL_FROM, //'PEV_Shop@example.org',
    to: receiver,
    subject: EMAIL_TYPES_CONFIG[emailType].subject,
    html: EMAIL_TYPES_CONFIG[emailType].getMessage(link),
  };

  return transporter.sendMail(mailOptions);
}

// sendMail('ScriptyChris@gmail.com', 'ACTIVATION', 'https://example.org');
