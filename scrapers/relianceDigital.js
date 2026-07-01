const puppeteer = require('puppeteer');

const scrapeRelianceDigital = async (query) => {
  const url = `https://www.reliancedigital.in/search?q=${encodeURIComponent(query)}:relevance`;
  console.log('🔍 Scraping Reliance Digital for:', url);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36'
  );

  await page.goto(url, { waitUntil: 'domcontentloaded' });

  console.log('running');
  const results = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('div.main-container > div.main-grid > div[data-v-7b97c6d0] > div.product-card')).map(el => {
      const title = el.querySelector('.card-info-container .product-card-details .product-card-title')?.innerText.trim();
      const price = el.querySelector('.card-info-container .product-card-details .price-container .price')?.innerText.trim();
      const realprice = el.querySelector('.card-info-container .product-card-details .mrp-and-rating-container .mrp-amount')?.innerText.trim();
      const off = el.querySelector('.card-info-container .product-card-details .price-container .discount')?.innerText.trim();
      const link = el.querySelector('.card-info-container .product-card-details > a')?.href;
      const img = el.querySelector('.card-info-container > a .unblur .fy__img')?.src;

      return { title, price, realprice, off, img, link };
    }).filter(item => item.title && item.price);
  });

    console.log("Fetching Data..");
  results.forEach(({ title, price }) => {
    console.log(`${title}`);
    console.log(`${price}`);
  });

  await browser.close();
  return results.slice(0, 5);
};

// Example run

module.exports = scrapeRelianceDigital;
