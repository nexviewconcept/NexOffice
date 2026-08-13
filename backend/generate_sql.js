const { execSync } = require('child_process');
const fs = require('fs');
try {
  const sql = execSync('npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script').toString();
  fs.writeFileSync('database_schema.sql', sql);
  console.log('SQL generated successfully.');
} catch (e) {
  console.error(e.message);
}
