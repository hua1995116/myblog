const puppeteer = require('puppeteer');

async function run() {
    console.log('Start to crawl girl\'s pivtures...');
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--ash-host-window-bounds=1920x1080'], // 
      headless: true,
      ignoreHTTPSErrors: true
    });
    const page = await browser.newPage();
    page.waitFor(3000);
    page.setViewport({width:800, height:2690});
    page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36');
    const url = `http://localhost:8000/html/me.html`;

    await page.goto(url, {waitUntil: 'networkidle2'});
    await page.pdf({path: 'me.pdf', format: 'A4', printBackground: true});
    await page.close()
    await browser.close();
}
run();