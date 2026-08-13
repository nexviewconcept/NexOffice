
INSERT INTO "Role" ("id", "name", "description") VALUES ('2feccf52-892f-4cf6-84d9-e330a0adbbda', 'SUPER_ADMIN', 'System Administrator');

INSERT INTO "User" ("id", "email", "passwordHash", "status", "createdAt", "updatedAt") 
VALUES ('b8da429d-2ff7-4bfa-b1ad-59195280dc6b', 'admin@nexviewconcept.com.ng', '$argon2id$v=19$m=65536,p=4,t=3$dHt8Xxl4eI2h1pbxEwjrvQ$ll/SUY4CLgukRDq4zabjL/rSrQqg8OIKJp0j7OEQSLs', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "UserRole" ("userId", "roleId") VALUES ('b8da429d-2ff7-4bfa-b1ad-59195280dc6b', '2feccf52-892f-4cf6-84d9-e330a0adbbda');

INSERT INTO "StaffProfile" ("id", "userId", "firstName", "lastName", "department", "designation") 
VALUES ('649e326c-3210-46af-8374-05c8bce783ef', 'b8da429d-2ff7-4bfa-b1ad-59195280dc6b', 'System', 'Administrator', 'Management', 'Super Admin');
