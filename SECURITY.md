# NexOffice Security Architecture

## Authentication
- **Mechanism**: JWT (JSON Web Tokens).
- **Storage**: Tokens are stored in memory/localStorage on the frontend and transmitted via the `Authorization: Bearer` header.
- **Password Hashing**: Uses `bcrypt` (or `argon2` in production) to hash all passwords. Plain text passwords are never stored.

## Authorization & RBAC
- **Roles**: SUPER_ADMIN, DIRECTOR, OPERATOR.
- **Implementation**: NestJS `@Roles()` decorator combined with `RolesGuard`.
- **Enforcement**: Server-side route protection. The frontend UI also conditionally hides elements based on the user's role.

## Data Protection
- **Audit Logging**: All destructive or critical actions (CREATE, UPDATE, DELETE) are logged in the `AuditLog` table with the user's ID, action type, and IP address.
- **File Security**: Uploaded files are renamed using UUIDs and stored outside the public web root. Downloads are streamed through the backend with strict permission checks.

## API Security
- **CORS**: Configured to restrict cross-origin requests in production.
- **Validation**: NestJS `ValidationPipe` ensures all incoming payload data matches expected DTO schemas, stripping out malicious injected properties.
