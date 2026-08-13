"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const nodemailer = __importStar(require("nodemailer"));
let EmailsService = EmailsService_1 = class EmailsService {
    prisma;
    logger = new common_1.Logger(EmailsService_1.name);
    transporter;
    constructor(prisma) {
        this.prisma = prisma;
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'mail.nexviewconcept.com.ng',
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS,
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
    async sendEmail(recipient, subject, template, attachmentPath, senderEmail, bodyText) {
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
                const smtpUser = process.env.SMTP_USER;
                const mailOptions = {
                    from: `"${process.env.SMTP_FROM_NAME || 'NexOffice'}" <${smtpUser}>`,
                    replyTo: senderEmail || smtpUser,
                    to: recipient,
                    subject: subject,
                    html: bodyText ? `<div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.6;">${bodyText.replace(/\n/g, '<br/>')}</div>` : (template || `<p>${subject}</p>`)
                };
                if (attachmentPath) {
                    mailOptions.attachments = [{
                            path: attachmentPath
                        }];
                }
                const info = await this.transporter.sendMail(mailOptions);
                this.logger.log(`Nodemailer result for ${recipient}: ${JSON.stringify(info)}`);
                await this.prisma.emailLog.update({
                    where: { id: log.id },
                    data: { status: 'SENT', sentAt: new Date() }
                });
                this.logger.log(`Email successfully SENT to ${recipient}`);
            }
            catch (err) {
                this.logger.error(`Email FAILED to send to ${recipient}`, err);
                await this.prisma.emailLog.update({
                    where: { id: log.id },
                    data: { status: 'FAILED' }
                });
            }
        }, 100);
        return { message: 'Email queued successfully', logId: log.id };
    }
    async retryEmail(id) {
        const log = await this.prisma.emailLog.findUnique({ where: { id } });
        if (!log)
            throw new common_1.NotFoundException('Email log not found');
        if (log.status === 'SENT') {
            return { message: 'Email already sent successfully' };
        }
        await this.prisma.emailLog.update({
            where: { id },
            data: { status: 'QUEUED' }
        });
        setTimeout(async () => {
            try {
                const smtpUser = process.env.SMTP_USER;
                const mailOptions = {
                    from: `"${process.env.SMTP_FROM_NAME || 'NexOffice'}" <${smtpUser}>`,
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
            }
            catch (err) {
                this.logger.error('Failed to retry email sending', err);
                await this.prisma.emailLog.update({
                    where: { id },
                    data: { status: 'FAILED' }
                });
            }
        }, 500);
        return { message: 'Email retry queued' };
    }
};
exports.EmailsService = EmailsService;
exports.EmailsService = EmailsService = EmailsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmailsService);
//# sourceMappingURL=emails.service.js.map