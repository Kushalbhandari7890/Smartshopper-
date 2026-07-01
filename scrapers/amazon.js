const axios = require('axios')
const cheerio = require('cheerio')

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const getRandomDelay = () => Math.floor(Math.random() * (3000 - 1000 + 1) + 1000)

const getHeaders = () => ({
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Cache-Control': 'max-age=0',
})

const scrapeAmazon = async (query, retryCount = 3) => {
  const url = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`
  
  // console.log(`Scraping Amazon for: ${query}`)

  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      // Add a random delay between requests
      if (attempt > 1) {
        const delayTime = getRandomDelay()
        console.log(`Retry attempt ${attempt}, waiting ${delayTime}ms...`)
        await delay(delayTime)
      }

      const res = await axios.get(url, { 
        headers: getHeaders(),
        // Uncomment the following lines if you want to use a proxy
        // proxy: {
        //   host: 'your-proxy-host',
        //   port: your-proxy-port
        // }
      })

      const $ = cheerio.load(res.data)
      const results = []

      $('div.s-main-slot > div[data-asin]').each((i, el) => {
        const title = $(el).find('h2 span').text().trim()
        const price = $(el).find('.a-price .a-offscreen').first().text().trim()
        const realprice = $(el).find('.a-text-price .a-offscreen').text()
        const img = $(el).find('.a-section .s-image').attr('src')

        const dprice = parseFloat(price.replace(/[₹,]/g, '')) || 0
        const drealPrice = parseFloat(realprice.replace(/[₹,]/g, '')) || 0
        
        // Calculate discount percentage
        let discountPercentage = 0
        if (drealPrice > 0 && dprice > 0) {
          discountPercentage = Math.round(((drealPrice - dprice) / drealPrice) * 100)
        } 

        let href = $(el).find('h2 a').attr('href')
        if (!href) {
          href = $(el).find('a.a-link-normal').attr('href')
        }

        const link = href ? `https://www.amazon.in${href}` : null

        if (title && price && link && realprice && img && discountPercentage) {
          results.push({ title, price, link, realprice, img, discountPercentage })
        }
      })
      return results.slice(0, 5)
    /*  if (results.length > 0) {
        console.log(`Successfully scraped ${results.length} products`)
        return results.slice(0, 5)
      } else {
        throw new Error('No products found')
      } */

    } catch (err) {
      console.error(`Amazon Scrape Error (Attempt ${attempt}/${retryCount}):`, err.message)
      if (attempt === retryCount) {
        console.error('Max retry attempts reached')
        return []
      }
    }
  }

  return []
}

module.exports = scrapeAmazon
