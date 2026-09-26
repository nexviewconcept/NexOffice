const puppeteer = require('puppeteer');

async function testPdf() {
  const htmlContent = 
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      </head>
      <body>
        <h1>Test Invoice PDF</h1>
      </body>
    </html>
  ;
  
  let browser;
  try {
    console.log('Launching browser...');
    browser = await puppeteer.launch({
      headless: true,
      executablePath: 'D:\\NexPortal\\NexOffice\\chrome\\win64-152.0.7977.75\\chrome-win64\\chrome.exe',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    });
    console.log('Browser launched');
    const page = await browser.newPage();
    console.log('Setting content...');
    await page.setContent(htmlContent, { waitUntil: 'networkidle2', timeout: 30000 });
    console.log('Generating PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true
    });
    console.log('PDF Generated, size:', pdfBuffer.length);
  } catch (error) {
    console.error('PDF Generation Error:', error);
  } finally {
    if (browser) await browser.close();
  }
}

testPdf();
