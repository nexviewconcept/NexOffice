const http = require('http');
const data = JSON.stringify({ email: 'md@nexviewconcept.com.ng', password: '@Aminu17576' });
const req = http.request({ hostname: 'localhost', port: 3000, path: '/api/v1/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': data.length } }, res => {
  let body = ''; res.on('data', c => body += c); res.on('end', () => console.log('Login:', res.statusCode, body));
});
req.write(data); req.end();
