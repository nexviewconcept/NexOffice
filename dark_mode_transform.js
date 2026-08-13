const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, 'frontend/src/pages'),
  path.join(__dirname, 'frontend/src/components')
];

const replacements = [
  { regex: /\bbg-white(?! dark:)\b/g, replacement: 'bg-white dark:bg-gray-900' },
  { regex: /\bbg-gray-50(?! dark:)\b/g, replacement: 'bg-gray-50 dark:bg-gray-950' },
  { regex: /\bbg-gray-100(?! dark:)\b/g, replacement: 'bg-gray-100 dark:bg-gray-800' },
  { regex: /\bborder-gray-100(?! dark:)\b/g, replacement: 'border-gray-100 dark:border-gray-800' },
  { regex: /\bborder-gray-200(?! dark:)\b/g, replacement: 'border-gray-200 dark:border-gray-700' },
  { regex: /\bborder-gray-300(?! dark:)\b/g, replacement: 'border-gray-300 dark:border-gray-600' },
  { regex: /\btext-gray-900(?! dark:)\b/g, replacement: 'text-gray-900 dark:text-gray-100' },
  { regex: /\btext-gray-800(?! dark:)\b/g, replacement: 'text-gray-800 dark:text-gray-100' },
  { regex: /\btext-gray-700(?! dark:)\b/g, replacement: 'text-gray-700 dark:text-gray-300' },
  { regex: /\btext-gray-600(?! dark:)\b/g, replacement: 'text-gray-600 dark:text-gray-400' },
  { regex: /\btext-gray-500(?! dark:)\b/g, replacement: 'text-gray-500 dark:text-gray-400' },
  { regex: /\bhover:bg-gray-50(?! dark:)\b/g, replacement: 'hover:bg-gray-50 dark:hover:bg-gray-800' },
  { regex: /\bhover:bg-gray-100(?! dark:)\b/g, replacement: 'hover:bg-gray-100 dark:hover:bg-gray-700' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      replacements.forEach(({ regex, replacement }) => {
        content = content.replace(regex, replacement);
      });
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

directories.forEach(dir => processDirectory(dir));
console.log('Dark mode transformation complete.');
