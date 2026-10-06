const fs = require('fs');
let code = fs.readFileSync('src/pages/JpgToPdf.tsx', 'utf8');

code = code.replace(/text-blue-600/g, 'text-[#E50914]');
code = code.replace(/border-blue-400/g, 'border-red-400');
code = code.replace(/bg-blue-600/g, 'bg-[#E50914]');
code = code.replace(/hover:bg-blue-700/g, 'hover:bg-red-700');

fs.writeFileSync('src/pages/JpgToPdf.tsx', code);
