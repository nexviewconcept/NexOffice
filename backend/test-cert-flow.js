const fs = require('fs');

async function testCert() {
  try {
    console.log('Logging in...');
    const loginRes = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@nexviewconcept.com.ng',
        password: '@Nx.cl17576'
      })
    });
    
    if (!loginRes.ok) throw new Error('Login failed');
    const loginData = await loginRes.json();
    const token = loginData.access_token;
    
    console.log('Creating Certificate...');
    const certRes = await fetch('http://localhost:3000/api/v1/certificates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        recipientName: 'Test Student',
        courseName: 'Web Development Bootcamp',
        issueDate: new Date().toISOString()
      })
    });

    if (!certRes.ok) {
      const errData = await certRes.text();
      throw new Error(`Cert creation failed: ${errData}`);
    }
    const certData = await certRes.json();
    const certId = certData.id;
    const certNum = certData.certificateNumber;
    console.log(`Created Cert: ${certNum} with ID: ${certId}`);

    console.log('Generating PDF...');
    const pdfRes = await fetch(`http://localhost:3000/api/v1/certificates/${certId}/pdf`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!pdfRes.ok) throw new Error('PDF generation failed');
    const pdfBuffer = await pdfRes.arrayBuffer();
    
    const pdfSize = pdfBuffer.byteLength;
    console.log(`Downloaded PDF Size: ${pdfSize} bytes`);
    
    if (pdfSize > 1000) {
      console.log('SUCCESS: Certificate PDF generated correctly!');
    } else {
      console.error('ERROR: PDF size seems too small or invalid.');
    }

  } catch (error) {
    console.error('Test Failed:', error);
  }
}

testCert();
