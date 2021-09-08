import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { join } from 'path';
import { compileFile, LocalsObject } from 'pug';

import { MailingConfig } from '../config/mailing.config';
import { SendMailResponse } from './types';

const TEMPLATE_DIR = join(__dirname, '..', '..', 'templates', 'mail');

@Injectable()
export class MailingService {
  private transporter: Transporter;
  private fromName: string;
  private fromMail: string;

  constructor(private configService: ConfigService) {
    const { smtpConfig, senderConfig }: MailingConfig = this.configService.get(
      'mailing',
    );

    this.fromMail = senderConfig.fromMail;
    this.fromName = senderConfig.fromName;
    this.transporter = createTransport(smtpConfig);
  }

  async sendMail(
    toAdress: string,
    subject: string,
    content: string,
    attachments?: Mail.Attachment[],
  ): Promise<boolean> {
    try {
      const result: SendMailResponse = await this.transporter.sendMail({
        from: `"${this.fromName}" <${this.fromMail}>`,
        to: toAdress,
        subject,
        html: content,
        attachments,
      });
      return result.accepted.includes(toAdress);
    } catch (error) {
      throw error;
    }
  }

  async sendTemplateMail(
    toAdress: string,
    subject: string,
    templateName: string,
    data: LocalsObject,
    attachments?: string[],
  ): Promise<boolean> {
    const compiledMailTemplete = compileFile(
      `${TEMPLATE_DIR}/${templateName}.pug`,
      { cache: true },
    );

    const mailContent = compiledMailTemplete(data);

    const mailAttachments: Mail.Attachment[] = [];

    attachments.forEach((path) => {
      mailAttachments.push({ path });
    });

    return this.sendMail(toAdress, subject, mailContent, mailAttachments);
  }
}
