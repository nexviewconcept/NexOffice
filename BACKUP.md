# NexOffice Backup Strategy

The application does not automatically back up files to the cloud. You must configure server-level backups.

## 1. Database Backup
For SQLite (Development):
- Periodically copy `backend/prisma/dev.db` to a secure location.

For PostgreSQL (Production):
- Use `pg_dump` in a daily cron job:
  ```bash
  pg_dump -U postgres nexoffice > /backups/nexoffice_$(date +%F).sql
  ```

## 2. File Backup
All uploaded documents (Invoices, Legal files, HR documents) are stored in:
`backend/uploads/`

- Create a cron job to sync this directory to an S3 bucket or external drive using `rsync` or the AWS CLI:
  ```bash
  aws s3 sync /path/to/backend/uploads s3://nexoffice-backups/uploads/
  ```

## 3. Retention
Maintain at least 30 days of daily backups and 12 months of monthly backups for compliance.
