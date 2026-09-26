require('dotenv').config();
const nodemailer = require('nodemailer');
async function testEmail() {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    tls: { rejectUnauthorized: false }
  });
  try {
    let info = await transporter.sendMail({
      from: '\"Nexview Admin\" <md@nexviewconcept.com.ng>',
      to: 'nexviewconceptltd@gmail.com',
      subject: 'Gwajin Sabar Imel (Test 2)',
      html: 'Testing different sender address.'
    });
    console.log('Success!', info.messageId);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
testEmail();
