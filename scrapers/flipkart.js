const axios = require('axios')
const cheerio = require('cheerio')



const scrapeFlipkart = async (query) => {
  const url = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`
  console.log('🔍 Scraping Flipkart for:', url)
  // const headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://www.google.com/',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  }

  try {
    const res = await axios.get(url, { headers, withCredentials: true })
    const $ = cheerio.load(res.data)
    const results = []

    $('div.gdgoEp > div.cPHDOP').each((i, el) => {
      //console.log("Hello World");
      const linkTag = $(el).find('div.KzDlHZ' || 'a.wjcEIp')
      const title = linkTag.text()
      const price = $(el).find('.tUxRFH .col-5-12 ._4b5DiR').text()
      const off = $(el).find('.hl05eU .UkUFwK ').text()
      const realprice = $(el).find('.tUxRFH .col-5-12 .yRaY8j').text()
      const img = $(el).find('._4WELSP .DByuf4').attr('src')
      const relativeLink = $(el).find('.tUxRFH .CGtC98').attr('href')
      
      //const link = relativeLink?.startsWith('/') ? `https://www.flipkart.com${relativeLink}` : null
      const link = relativeLink ? `https://www.flipkart.com${relativeLink}` : null

      // console.log(link)
      //  console.log('-------------------------')
      //  console.log(price)
      //  console.log(title)

      if (title && price && link && realprice && img && off) {
        results.push({ title, price, link, realprice, img, off })
      }
    })

    return results.slice(0, 5)
  } catch (err) {
    console.error('Flipkart Scrape Error:', err.message)
    return []
  }
}

module.exports = scrapeFlipkart
