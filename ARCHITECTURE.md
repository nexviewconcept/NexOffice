# NexOffice Architecture

## Overview
NexOffice is a monolithic, multi-layered enterprise web application built for Nexview Concept Limited.

## Frontend Architecture
- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **State Management**: Zustand (for Auth), React Context
- **Styling**: Tailwind CSS, Lucide React icons
- **Routing**: React Router DOM (v6)
- **API Client**: Axios with JWT Interceptors

## Backend Architecture
- **Framework**: NestJS
- **Language**: TypeScript
- **Database ORM**: Prisma
- **Database**: SQLite (Development) / PostgreSQL (Production ready)
- **Authentication**: JWT (JSON Web Tokens) with Argon2id hashing
- **File Storage**: Local Disk Storage (via Multer)

## Core Modules
1. **Auth**: Handles login, JWT generation, and role-based access control.
2. **Users & Staff**: Manages user accounts and extended staff profiles.
3. **Clients**: Manages CRM data.
4. **Finance & Invoicing**: Manages revenue, expenses, and PDF invoice generation.
5. **Inventory**: Tracks assets and consumables with history.
6. **Files**: Secure document storage.
7. **Notifications**: CRON-based scheduling for recurring announcements.
8. **Email**: Queue-based email dispatching (currently mocked).
9. **Settings & Audit**: System configuration and immutable activity logs.
