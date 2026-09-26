const puppeteer = require('puppeteer');
async function test() {
  const p = 'D:\\\\NexPortal\\\\NexOffice\\\\chrome\\\\win64-152.0.7977.75\\\\chrome-win64\\\\chrome.exe';
  console.log('Path used:', p);
  const browser = await puppeteer.launch({ headless: true, executablePath: p });
  console.log('Launched!');
  await browser.close();
}
test().catch(console.error);
