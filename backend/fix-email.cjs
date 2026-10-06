const fs = require('fs');
let code = fs.readFileSync('src/acceptance-letters/acceptance-letters.service.ts', 'utf8');

const regex = /await this\.emailsService\.sendEmailWithAttachment\([\s\S]*?Acceptance_Letter_\$\{letter\.matricNumber\}\.pdf[\s\S]*?\);/g;

code = code.replace(regex, "await this.emailsService.sendEmail(email, 'IT Acceptance Letter - Nexview Concept', undefined, undefined, 'info@nexviewconcept.com.ng', Dear \,\\n\\nPlease find attached your IT Acceptance Letter.\\n\\nBest regards,\\nNexview Concept, pdfBuffer, Acceptance_Letter_\.pdf);");

fs.writeFileSync('src/acceptance-letters/acceptance-letters.service.ts', code);
