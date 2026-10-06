const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      content = content.replace(/bg-blue-600/g, 'bg-[#E50914]');
      content = content.replace(/bg-blue-500/g, 'bg-red-500');
      content = content.replace(/bg-blue-700/g, 'bg-red-700');
      content = content.replace(/bg-blue-50/g, 'bg-red-50');
      content = content.replace(/bg-blue-100/g, 'bg-red-100');
      
      content = content.replace(/text-blue-600/g, 'text-[#E50914]');
      content = content.replace(/text-blue-500/g, 'text-red-500');
      content = content.replace(/text-blue-700/g, 'text-red-700');
      content = content.replace(/text-blue-400/g, 'text-red-400');
      
      content = content.replace(/border-blue-600/g, 'border-[#E50914]');
      content = content.replace(/border-blue-500/g, 'border-red-500');
      content = content.replace(/border-blue-200/g, 'border-red-200');
      content = content.replace(/border-blue-400/g, 'border-red-400');
      
      content = content.replace(/hover:bg-blue-600/g, 'hover:bg-[#E50914]');
      content = content.replace(/hover:bg-blue-700/g, 'hover:bg-red-700');
      content = content.replace(/hover:text-blue-600/g, 'hover:text-[#E50914]');
      content = content.replace(/hover:text-blue-700/g, 'hover:text-red-700');
      content = content.replace(/hover:border-blue-400/g, 'hover:border-red-400');
      
      content = content.replace(/ring-blue-500/g, 'ring-red-500');
      content = content.replace(/focus:border-blue-500/g, 'focus:border-red-500');
      content = content.replace(/focus:ring-blue-500/g, 'focus:ring-red-500');
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + fullPath);
      }
    }
  }
}

processDir('src');
