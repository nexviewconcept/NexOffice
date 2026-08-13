# NexOffice API Documentation

## Base URL
All API routes are prefixed with `/api/v1`.

## Authentication
Most routes require a valid JWT passed in the `Authorization` header:
`Authorization: Bearer <token>`

## Key Endpoints

### Auth
- `POST /auth/login`: Authenticate and receive a JWT.
- `GET /auth/me`: Get current user details.

### Users & Staff
- `GET /users`: List users (requires SUPER_ADMIN or DIRECTOR).
- `POST /users`: Create a new user.
- `PUT /users/:id/role`: Update user role.
- `GET /staff-profiles/:userId`: Get staff profile details.

### Clients
- `GET /clients`: List clients.
- `POST /clients`: Add a new client.

### Invoices & Receipts
- `GET /invoices`: List invoices.
- `POST /invoices`: Create an invoice.
- `POST /invoices/:id/receipts`: Create a payment receipt for an invoice.

### Finance
- `GET /finance/dashboard`: Get revenue, expenses, and net balance summaries.
- `GET /finance/expenses`: List expenses.

### Inventory
- `GET /inventory`: List assets and stock.
- `POST /inventory/:id/transactions`: Log a stock in/out transaction.

### Files
- `POST /files/upload`: Upload a file to a specific category.
- `GET /files/download/:id`: Stream file for download.

### Announcements
- `POST /notifications/announcements`: Create a scheduled announcement.
- `POST /notifications/cron/tick`: Manual trigger for CRON scheduler.
