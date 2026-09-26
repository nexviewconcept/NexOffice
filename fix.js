const fs = require('fs');
const files = [
  'frontend/src/lib/api.ts',
  'frontend/src/components/layout/DashboardLayout.tsx',
  'frontend/src/pages/Settings.tsx',
  'frontend/src/pages/StaffProfiles.tsx',
  'frontend/src/pages/Backups.tsx',
  'frontend/src/pages/public/VerifyStaff.tsx',
  'frontend/src/pages/student/StudentProfile.tsx'
];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/'http:\/\/localhost:3000'/g, "'https://nexoffice-api.fly.dev'");
  content = content.replace(/http:\/\/localhost:3000/g, "https://nexoffice-api.fly.dev");
  fs.writeFileSync(f, content);
});
console.log('Replaced localhost successfully');
