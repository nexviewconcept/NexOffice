// Ambient module declarations for packages whose @types/* are not installed
// in this environment (e.g. bcryptjs ships no types and @types/bcryptjs is
// unavailable). Declaring it here prevents TS7016 errors during compilation
// without requiring network access to fetch type packages.

declare module 'bcryptjs';
