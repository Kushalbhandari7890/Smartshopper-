const puppeteer = require('puppeteer');

const scrapeFlipkart = async (query) => {
  const url = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`
 
  //console.log('🔍 Scraping Flipkart for:', url)
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36')
  await page.goto(url, { waitUntil: 'domcontentloaded' })

  const results = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('div.gdgoEp > div.cPHDOP')).map(el => {
      const title = el.querySelector('div.KzDlHZ, a.wjcEIp')?.innerText
      const price = el.querySelector('.tUxRFH .col-5-12 ._4b5DiR')?.innerText
      const realprice = el.querySelector('.tUxRFH .col-5-12 .yRaY8j')?.innerText
      const off = el.querySelector('.hl05eU .UkUFwK')?.innerText
      const img = el.querySelector('._4WELSP .DByuf4')?.src
      const link = el.querySelector('.tUxRFH .CGtC98')?.href
      return { title, price, realprice, off, img, link }
    }).filter(item => item.title && item.price)
  })

  await browser.close()
  return results.slice(0, 5)
}
module.exports = scrapeFlipkart