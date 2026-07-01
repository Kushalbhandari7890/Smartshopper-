const express = require('express')
const router = express.Router()
const scrapeAmazon = require('../scrapers/amazon')
//const scrapeFlipkart = require('../scrapers/flipkart')  // Remove Comment to flipkart scraper is work
const scrapeFlipkart = require('../scrapers/newflipkart')  // Remove Comment to flipkart scraper is work
const scrapeRelianceDigital = require('../scrapers/relianceDigital')

router.post('/', async (req, res) => {
  const { query } = req.body
  if (!query) return res.status(400).json({ error: 'Missing query' })

  try {
    const [amazon, flipkart, relianceDigital] = await Promise.all([
      scrapeAmazon(query),
      scrapeFlipkart(query),   // Remove Comment to flipkart scraper is work               
      scrapeRelianceDigital(query)
    ])

    res.json({ 
      amazon, 
      flipkart, 
      relianceDigital 
    })
  } catch (error) {
    console.error('Comparison Error:', error)
    res.status(500).json({ 
      error: 'Error fetching product data',
      message: error.message 
    })
  }
})

module.exports = router