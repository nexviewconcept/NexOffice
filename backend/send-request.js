const http = require('http');

const data = JSON.stringify({
  email: 'md@nexviewconcept.com.ng',
  password: '@Aminu17576'
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/v1/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const json = JSON.parse(body);
    const token = json.token;
    
    // Now trigger the send email
    const req2 = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/invoices/486647ce-0b9d-4f6f-ae77-beedbcc5ef66/send-email',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }, res2 => {
      let body2 = '';
      res2.on('data', chunk => body2 += chunk);
      res2.on('end', () => {
        console.log('Email send response:', res2.statusCode, body2);
      });
    });
    req2.end();
  });
});

req.write(data);
req.end();
