
const imaps = require('imap-simple');

const config = {
    imap: {
        user: process.env.SMTP_USER || 'info@nexviewconcept.com.ng',
        password: process.env.SMTP_PASSWORD || 'jTzxCfzNDx9M',
        host: 'imap.zoho.com',
        port: 993,
        tls: true,
        authTimeout: 3000,
        tlsOptions: { rejectUnauthorized: false }
    }
};

imaps.connect(config).then(connection => {
    return connection.openBox('INBOX').then(() => {
        const searchCriteria = ['1:5'];
        const fetchOptions = { bodies: ['HEADER'], struct: true };
        return connection.search(searchCriteria, fetchOptions).then(messages => {
            console.log('Successfully connected and fetched messages:', messages.length);
            connection.end();
        });
    });
}).catch(err => {
    console.error('Failed to connect:', err);
});

