const fs = require('fs');

const file = 'src/emails/emails.controller.ts';
let code = fs.readFileSync(file, 'utf8');

const getInboxMethod = `
  @Roles('SUPER_ADMIN', 'DIRECTOR', 'OPERATOR')
  @Get('inbox')
  getInbox() {
    return this.emailsService.getInbox();
  }
`;

if (!code.includes("@Get('inbox')")) {
    const lastBraceIndex = code.lastIndexOf('}');
    code = code.slice(0, lastBraceIndex) + getInboxMethod + code.slice(lastBraceIndex);
    fs.writeFileSync(file, code);
    console.log('Successfully injected getInbox into EmailsController');
} else {
    console.log('Already injected');
}
