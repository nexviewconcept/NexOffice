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
var BackupsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupsService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const child_process_1 = require("child_process");
const util_1 = require("util");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const emails_service_1 = require("../emails/emails.service");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
let BackupsService = BackupsService_1 = class BackupsService {
    emailsService;
    logger = new common_1.Logger(BackupsService_1.name);
    backupsDir = path.join(__dirname, '..', '..', 'uploads', 'backups');
    constructor(emailsService) {
        this.emailsService = emailsService;
        if (!fs.existsSync(this.backupsDir)) {
            fs.mkdirSync(this.backupsDir, { recursive: true });
        }
    }
    async listBackups() {
        try {
            const files = fs.readdirSync(this.backupsDir);
            const backups = files.filter(f => f.endsWith('.sql') || f.endsWith('.sql.gz')).map(filename => {
                const stats = fs.statSync(path.join(this.backupsDir, filename));
                return {
                    filename,
                    size: stats.size,
                    createdAt: stats.birthtime
                };
            });
            return backups.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        }
        catch (err) {
            this.logger.error('Failed to list backups', err);
            return [];
        }
    }
    async generateBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `backup_nexoffice_${timestamp}.sql`;
        const filepath = path.join(this.backupsDir, filename);
        let dbUrl = process.env.DATABASE_URL;
        if (dbUrl && dbUrl.includes('?')) {
            dbUrl = dbUrl.split('?')[0];
        }
        let pgDumpPath = process.env.PG_DUMP_PATH || 'pg_dump';
        if (pgDumpPath.includes(' ') && !pgDumpPath.startsWith('"')) {
            pgDumpPath = `"${pgDumpPath}"`;
        }
        if (!dbUrl) {
            throw new common_1.HttpException('DATABASE_URL is missing', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        try {
            this.logger.log(`Generating backup at ${filepath}...`);
            const command = `${pgDumpPath} --dbname="${dbUrl}" --file="${filepath}"`;
            await execAsync(command);
            this.logger.log(`Backup completed successfully: ${filename}`);
            return { filename, path: filepath };
        }
        catch (err) {
            this.logger.error(`Backup failed: ${err.message}`, err);
            throw new common_1.HttpException(`Failed to generate backup: ${err.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteBackup(filename) {
        const filepath = path.join(this.backupsDir, filename);
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
            return { message: 'Backup deleted successfully' };
        }
        throw new common_1.HttpException('Backup not found', common_1.HttpStatus.NOT_FOUND);
    }
    async getBackupFileStream(filename) {
        const filepath = path.join(this.backupsDir, filename);
        if (!fs.existsSync(filepath)) {
            throw new common_1.HttpException('Backup not found', common_1.HttpStatus.NOT_FOUND);
        }
        return { stream: fs.createReadStream(filepath), filepath };
    }
    async sendBackupToEmail(filename, email) {
        const targetEmail = email || process.env.ADMIN_NOTIFY_EMAIL;
        if (!targetEmail) {
            throw new common_1.HttpException('No target email provided', common_1.HttpStatus.BAD_REQUEST);
        }
        const filepath = path.join(this.backupsDir, filename);
        if (!fs.existsSync(filepath)) {
            throw new common_1.HttpException('Backup file not found', common_1.HttpStatus.NOT_FOUND);
        }
        try {
            await this.emailsService.sendEmail(targetEmail, `NexOffice Database Backup: ${filename}`, 'Please find the attached database backup.', filepath);
            return { message: 'Backup emailed successfully' };
        }
        catch (err) {
            this.logger.error('Failed to email backup', err);
            throw new common_1.HttpException('Failed to send email', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async handleDailyAutonomousBackup() {
        this.logger.log('Running daily autonomous backup...');
        try {
            const result = await this.generateBackup();
            this.logger.log(`Daily backup generated: ${result.filename}`);
            const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
            if (adminEmail) {
                this.logger.log(`Autonomously emailing backup to ${adminEmail}...`);
                await this.sendBackupToEmail(result.filename, adminEmail);
            }
        }
        catch (error) {
            this.logger.error('Daily autonomous backup failed', error);
        }
    }
};
exports.BackupsService = BackupsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BackupsService.prototype, "handleDailyAutonomousBackup", null);
exports.BackupsService = BackupsService = BackupsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [emails_service_1.EmailsService])
], BackupsService);
//# sourceMappingURL=backups.service.js.map