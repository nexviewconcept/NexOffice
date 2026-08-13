const argon2 = require('argon2');
const fs = require('fs');
const crypto = require('crypto');

async function generateSeedSql() {
  const passwordHash = await argon2.hash('@Nx.cl17576');
  
  const superAdminRoleId = crypto.randomUUID();
  const userId = crypto.randomUUID();
  const staffProfileId = crypto.randomUUID();

  const sql = `
INSERT INTO "Role" ("id", "name", "description") VALUES ('${superAdminRoleId}', 'SUPER_ADMIN', 'System Administrator');

INSERT INTO "User" ("id", "email", "passwordHash", "status", "createdAt", "updatedAt") 
VALUES ('${userId}', 'admin@nexviewconcept.com.ng', '${passwordHash}', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "UserRole" ("userId", "roleId") VALUES ('${userId}', '${superAdminRoleId}');

INSERT INTO "StaffProfile" ("id", "userId", "firstName", "lastName", "department", "designation") 
VALUES ('${staffProfileId}', '${userId}', 'System', 'Administrator', 'Management', 'Super Admin');
`;

  fs.writeFileSync('seed_data.sql', sql);
  console.log('Seed SQL generated.');
}

generateSeedSql();
