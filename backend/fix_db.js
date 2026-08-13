const fs = require('fs');

const tables = ['User', 'Role', 'Permission', 'UserRole', 'RolePermission', 'StaffProfile', 'Client', 'Invoice', 'InvoiceItem', 'Receipt', 'Certificate', 'File', 'ExpenseCategory', 'Expense', 'InventoryItem', 'InventoryTransaction', 'AuditLog', 'Ticket', 'TicketMessage', 'EmailLog', 'Announcement', 'AnnouncementOccurrence', 'NotificationReadStatus', 'SystemSetting', 'ServiceLog'];

let content = fs.readFileSync('database_schema.sql', 'utf8');
let seedContent = fs.readFileSync('seed_data.sql', 'utf8');

// Ensure we don't have DROP SCHEMA anywhere
content = content.replace(/DROP SCHEMA public CASCADE;\r?\nCREATE SCHEMA public;\r?\n/g, '');

const dropStatements = tables.map(t => `DROP TABLE IF EXISTS "${t}" CASCADE;`).join('\n') + '\n\n';

fs.writeFileSync('full_database.sql', dropStatements + content + '\n\n' + seedContent);
console.log('Fixed full_database.sql');
