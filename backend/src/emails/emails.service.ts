import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailsService {
  private readonly logger = new Logger(EmailsService.name);
  private transporter: nodemailer.Transporter;

  constructor(private prisma: PrismaService) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.zoho.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'info@nexviewconcept.com.ng',
        pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS ,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async getLogs() {
    return this.prisma.emailLog.findMany({
      orderBy: { sentAt: 'desc' }
    });
  }

  async sendEmail(recipient: string, subject: string, template?: string, attachmentPath?: string, senderEmail?: string, bodyText?: string, attachmentBuffer?: Buffer, attachmentFilename?: string) {
    this.logger.log(`Queueing email to ${recipient} (Subject: ${subject})`);
    
    const log = await this.prisma.emailLog.create({
      data: {
        recipient,
        subject,
        template,
        status: 'QUEUED'
      }
    });

    setTimeout(async () => {
      try {
        const smtpUser = process.env.SMTP_USER || 'info@nexviewconcept.com.ng';
        const smtpFromEmail = process.env.SMTP_FROM_EMAIL || 'info@nexviewconcept.com.ng';
        let fromName = process.env.SMTP_FROM_NAME || 'Nexview Concept Limited';
        
        if (senderEmail) {
          if (senderEmail.includes('md@')) {
            fromName = 'Nexview Admin';
          } else if (senderEmail.includes('support@')) {
            fromName = 'Nexview Support';
          } else if (senderEmail.includes('info@')) {
            fromName = 'Nexview Concept Limited';
          }
        }
        
        const mailOptions: any = {
          from: `"${fromName}" <${smtpFromEmail}>`,
          replyTo: senderEmail || smtpUser,
          to: recipient,
          subject: subject,
          html: bodyText ? `<div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.6;">${bodyText.replace(/\n/g, '<br/>')}</div>` : (template || `<p>${subject}</p>`)
        };

        if (attachmentPath) {
          mailOptions.attachments = [{
            path: attachmentPath
          }];
        } else if (attachmentBuffer && attachmentFilename) {
          mailOptions.attachments = [{
            filename: attachmentFilename,
            content: attachmentBuffer
          }];
        }

        const info = await this.transporter.sendMail(mailOptions);
        this.logger.log(`Nodemailer result for ${recipient}: ${JSON.stringify(info)}`);
        
        await this.prisma.emailLog.update({
          where: { id: log.id },
          data: { status: 'SENT', sentAt: new Date() }
        });
        
        this.logger.log(`Email successfully SENT to ${recipient}`);
      } catch (err) {
        this.logger.error(`Email FAILED to send to ${recipient}`, err);
        await this.prisma.emailLog.update({
          where: { id: log.id },
          data: { status: 'FAILED' }
        });
      }
    }, 100);

    return { message: 'Email queued successfully', logId: log.id };
  }

  async retryEmail(id: string) {
    const log = await this.prisma.emailLog.findUnique({ where: { id } });
    if (!log) throw new NotFoundException('Email log not found');

    if (log.status === 'SENT') {
      return { message: 'Email already sent successfully' };
    }

    await this.prisma.emailLog.update({
      where: { id },
      data: { status: 'QUEUED' }
    });

    setTimeout(async () => {
      try {
        const smtpUser = process.env.SMTP_USER || 'info@nexviewconcept.com.ng';
        const smtpFromEmail = process.env.SMTP_FROM_EMAIL || 'info@nexviewconcept.com.ng';
        let fromName = process.env.SMTP_FROM_NAME || 'Nexview Concept Limited';
        
        const mailOptions: any = {
          from: `"${fromName}" <${smtpFromEmail}>`,
          to: log.recipient,
          subject: log.subject,
          html: log.template || `<p>${log.subject}</p>`
        };

        const info = await this.transporter.sendMail(mailOptions);
        this.logger.log(`Retry Nodemailer result: ${JSON.stringify(info)}`);

        await this.prisma.emailLog.update({
          where: { id },
          data: { status: 'SENT', sentAt: new Date() }
        });
      } catch (err) {
        this.logger.error('Failed to retry email sending', err);
        await this.prisma.emailLog.update({
          where: { id },
          data: { status: 'FAILED' }
        });
      }
    }, 500);

    return { message: 'Email retry queued' };
  }
}



