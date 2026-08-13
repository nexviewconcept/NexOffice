# NexOffice Database Schema

## ORM
We use Prisma ORM to manage the database schema and migrations.

## Core Entities
1. **User**: Authentication credentials and RBAC roles.
2. **StaffProfile**: Personal and HR information for a User.
3. **Client**: External customers and businesses.
4. **Invoice & InvoiceItem**: Billing and line items.
5. **Receipt**: Payment records linked to Invoices.
6. **Expense**: Company expenditures for the Finance module.
7. **InventoryItem & InventoryTransaction**: Asset tracking and stock movement.
8. **File**: Metadata for uploaded documents.
9. **Announcement & AnnouncementOccurrence**: Scheduled notification system.
10. **EmailLog**: Audit trail of outgoing communications.
11. **AuditLog**: Immutable tracker of critical system actions.
12. **SystemSetting**: Key-value store for global configurations.
