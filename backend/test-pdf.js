const puppeteer = require('puppeteer');

async function testPdf() {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: 'D:\\NexPortal\\NexOffice\\chrome\\win64-152.0.7977.75\\chrome-win64\\chrome.exe',
    });
    console.log('Browser launched successfully');
    const page = await browser.newPage();
    await page.setContent('<h1>Test</h1>', { waitUntil: 'load' });
    await page.pdf({ format: 'A4' });
    await browser.close();
    console.log('PDF generated successfully');
  } catch (err) {
    console.error('Error generating PDF:', err);
  }
}

testPdf();
