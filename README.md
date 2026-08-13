# NexOffice

An enterprise-grade internal company management and operations platform for **Nexview Concept Limited**.

## Overview
NexOffice is a comprehensive business system designed to handle human resources, client management, invoicing, receipt generation, operational finance, inventory tracking, secure file storage, announcements, and global auditing. 

It was built with an emphasis on **Security, Maintainability, Usability, and Clean Architecture**.

## Documentation
Please refer to the following documentation files for detailed insights into the architecture and setup:
- [ARCHITECTURE.md](./ARCHITECTURE.md) - High-level system architecture and stack.
- [DATABASE.md](./DATABASE.md) - Prisma ORM database schemas and entities.
- [SECURITY.md](./SECURITY.md) - RBAC, Authentication, and Data Protection strategies.
- [API.md](./API.md) - REST API routes and structure.
- [NOTIFICATIONS.md](./NOTIFICATIONS.md) - CRON-based scheduling and recurrence engine.
- [EMAIL_SETUP.md](./EMAIL_SETUP.md) - Transitioning the mock email queue to a production SMTP.
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guide for PM2 and Nginx production deployment.
- [BACKUP.md](./BACKUP.md) - Backup and data retention strategies.

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Zustand, Lucide React.
- **Backend**: Node.js, NestJS, TypeScript, Prisma ORM.
- **Database**: SQLite (Dev) -> PostgreSQL (Prod).

## Quick Start (Development)
```bash
# Terminal 1 - Backend
cd backend
npm install
cp .env.example .env
npx prisma db push
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to access the dashboard.
