const fs = require('fs');

const serviceCode = fs.readFileSync('src/emails/emails.service.ts', 'utf8');

const imapImport = `import * as imaps from 'imap-simple';
import { simpleParser } from 'mailparser';
`;

const getInboxMethod = `
  async getInbox() {
    const config = {
      imap: {
        user: process.env.SMTP_USER || 'info@nexviewconcept.com.ng',
        password: process.env.SMTP_PASSWORD || process.env.SMTP_PASS || 'jTzxCfzNDx9M',
        host: 'imap.zoho.com',
        port: 993,
        tls: true,
        authTimeout: 5000,
        tlsOptions: { rejectUnauthorized: false }
      }
    };

    try {
      const connection = await imaps.connect(config);
      await connection.openBox('INBOX');

      const searchCriteria = ['ALL'];
      const fetchOptions = {
        bodies: ['HEADER', 'TEXT', ''],
        struct: true,
        markSeen: false
      };

      // Fetch the latest 30 emails
      const messages = await connection.search(searchCriteria, fetchOptions);
      // Sort by descending date
      messages.reverse();
      const latestMessages = messages.slice(0, 30);

      const parsedEmails = [];

      for (const item of latestMessages) {
        const all = item.parts.find(part => part.which === '');
        const id = item.attributes.uid;
        const idHeader = 'Imap-Id: '+id+'\\r\\n';
        
        let mail = null;
        if (all) {
            mail = await simpleParser(idHeader + all.body);
        } else {
            const header = item.parts.find(part => part.which === 'HEADER');
            if (header) {
                mail = await simpleParser(header.body);
            }
        }

        if (mail) {
            parsedEmails.push({
            uid: id,
            from: mail.from?.text || 'Unknown Sender',
            subject: mail.subject || '(No Subject)',
            date: mail.date,
            text: mail.text || '',
            html: mail.html || mail.textAsHtml || ''
            });
        }
      }

      connection.end();
      return parsedEmails;
    } catch (err) {
      this.logger.error('IMAP Fetch Error', err);
      throw new Error(err.message || 'Failed to fetch emails via IMAP');
    }
  }
`;

let newCode = serviceCode;
if (!newCode.includes('imap-simple')) {
    newCode = imapImport + newCode;
    const lastBraceIndex = newCode.lastIndexOf('}');
    newCode = newCode.slice(0, lastBraceIndex) + getInboxMethod + newCode.slice(lastBraceIndex);
    fs.writeFileSync('src/emails/emails.service.ts', newCode);
    console.log('Successfully injected getInbox into EmailsService');
} else {
    console.log('Already injected');
}
