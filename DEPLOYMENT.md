# NexOffice Deployment Guide

## Prerequisites
- Node.js (v18+)
- PostgreSQL (Production) or SQLite (Testing)
- PM2 (Process Manager for Node.js)
- Nginx (Reverse Proxy)

## 1. Backend Setup
```bash
cd backend
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your production database URL and JWT Secret

# Generate Prisma Client and deploy schema
npx prisma generate
npx prisma migrate deploy # For Postgres

# Build the app
npm run build

# Start with PM2
pm2 start dist/main.js --name "nexoffice-api"
```

## 2. Frontend Setup
```bash
cd frontend
npm install

# Setup environment variables
cp .env.example .env
# Edit .env to point VITE_API_URL to your backend URL

# Build the frontend
npm run build
```

## 3. Nginx Configuration
Configure Nginx to serve the `frontend/dist` folder on port 80/443, and proxy `/api` requests to the PM2 backend running on port 3000.
