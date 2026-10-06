const fs = require('fs');
let code = fs.readFileSync('src/documents/documents.controller.ts', 'utf8');
code = code.replace(/\\'Content-Disposition\\': \\\\ ttachment; filename=compressed_\\\\\\\\,/g, "'Content-Disposition': 'attachment; filename=' + file.originalname,");
fs.writeFileSync('src/documents/documents.controller.ts', code);
