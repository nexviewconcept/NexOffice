const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
        user: 'info@nexviewconcept.com.ng',
        pass: 'jTzxCfzNDx9M'
    }
});
transporter.sendMail({
    from: 'Nexview Concept Limited <info@nexviewconcept.com.ng>',
    to: 'abdulhadianaskabir@gmail.com',
    subject: 'Test Email from NexOffice',
    text: 'This is a test email to verify Zoho SMTP credentials.'
}).then(info => console.log('Sent!', info)).catch(err => console.error('Error:', err));
