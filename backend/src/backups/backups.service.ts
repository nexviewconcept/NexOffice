import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { EmailsService } from '../emails/emails.service';

const execAsync = promisify(exec);

@Injectable()
export class BackupsService {
  private readonly logger = new Logger(BackupsService.name);
  private readonly backupsDir = path.join(__dirname, '..', '..', 'uploads', 'backups');

  constructor(private readonly emailsService: EmailsService) {
    // Ensure backups directory exists
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
    } catch (err) {
      this.logger.error('Failed to list backups', err);
      return [];
    }
  }

  async generateBackup(): Promise<{ filename: string; path: string }> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup_nexoffice_${timestamp}.sql`;
    const filepath = path.join(this.backupsDir, filename);

    // Extract database URL and PG Dump Path from env
    let dbUrl = process.env.DATABASE_URL;
    if (dbUrl && dbUrl.includes('?')) {
      dbUrl = dbUrl.split('?')[0];
    }
    
    let pgDumpPath = process.env.PG_DUMP_PATH || 'pg_dump';
    
    // Fallback logic for Windows paths (handle spaces)
    if (pgDumpPath.includes(' ') && !pgDumpPath.startsWith('"')) {
      pgDumpPath = `"${pgDumpPath}"`;
    }

    if (!dbUrl) {
      throw new HttpException('DATABASE_URL is missing', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    try {
      this.logger.log(`Generating backup at ${filepath}...`);
      // Warning: passing dbUrl in command line can be a security risk in shared servers if visible in ps
      const command = `${pgDumpPath} --dbname="${dbUrl}" --file="${filepath}"`;
      await execAsync(command);
      this.logger.log(`Backup completed successfully: ${filename}`);
      return { filename, path: filepath };
    } catch (err) {
      this.logger.error(`Backup failed: ${err.message}`, err);
      throw new HttpException(`Failed to generate backup: ${err.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteBackup(filename: string) {
    const filepath = path.join(this.backupsDir, filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      return { message: 'Backup deleted successfully' };
    }
    throw new HttpException('Backup not found', HttpStatus.NOT_FOUND);
  }

  async getBackupFileStream(filename: string) {
    const filepath = path.join(this.backupsDir, filename);
    if (!fs.existsSync(filepath)) {
      throw new HttpException('Backup not found', HttpStatus.NOT_FOUND);
    }
    return { stream: fs.createReadStream(filepath), filepath };
  }

  async sendBackupToEmail(filename: string, email?: string) {
    const targetEmail = email || process.env.ADMIN_NOTIFY_EMAIL;
    if (!targetEmail) {
      throw new HttpException('No target email provided', HttpStatus.BAD_REQUEST);
    }
    const filepath = path.join(this.backupsDir, filename);
    if (!fs.existsSync(filepath)) {
      throw new HttpException('Backup file not found', HttpStatus.NOT_FOUND);
    }

    try {
      await this.emailsService.sendEmail(
        targetEmail,
        `NexOffice Database Backup: ${filename}`,
        'Please find the attached database backup.',
        filepath
      );
      return { message: 'Backup emailed successfully' };
    } catch (err) {
      this.logger.error('Failed to email backup', err);
      throw new HttpException('Failed to send email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
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
      
    } catch (error) {
      this.logger.error('Daily autonomous backup failed', error);
    }
  }
}
