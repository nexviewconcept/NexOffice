async function testLogin() {
  try {
    console.log("Testing frontend API URL...");
    const res = await fetch('https://office.nexviewconcept.com.ng/api/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@nexviewconcept.com.ng',
        password: '@Nx.cl17576'
      })
    });
    
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch (err) {
    console.error("ERROR:");
    console.error(err.message);
  }
}

testLogin();
