const express = require('express');
const { db } = require('../db');
const scrapeContent = require('../utils/scraper');

const router = express.Router();

/**
 * @route POST /api/scrape
 * @description Scrapes content from a given URL using a CSS selector and saves it to the database.
 * @param {string} req.body.url - The URL of the webpage to scrape.
 * @param {string} req.body.selector - The CSS selector to identify the elements to extract.
 * @returns {JSON} - A success message with the scraped content and its ID, or an error message.
 */
router.post('/scrape', async (req, res) => {
    const { url, selector } = req.body;

    if (!url || !selector) {
        return res.status(400).json({ error: 'URL and selector are required.' });
    }

    try {
        const extractedContent = await scrapeContent(url, selector);
        if (!extractedContent) {
            return res.status(404).json({ message: 'No content found for the given selector or URL.' });
        }
        db.run(`INSERT INTO scraped_items (url, selector, content) VALUES (?, ?, ?)`,
            [url, selector, extractedContent],
            function (err) {
                if (err) {
                    console.error('Error inserting data into DB:', err.message);
                    return res.status(500).json({ error: 'Failed to save scraped data to database.' });
                }
                console.log(`A row has been inserted with rowid ${this.lastID}`);
                res.status(200).json({ message: 'Scraping successful and data saved!', content: extractedContent, id: this.lastID });
            }
        );

    } catch (error) {
        console.error('Scraping error in route handler:', error.message);
        if (error.response) {
            res.status(error.response.status).json({ error: `Failed to fetch URL (${error.response.status}): ${error.message}` });
        } else if (error.request) {
            res.status(503).json({ error: `No response received from URL. Please check the URL or your network connection.` });
        } else {
            res.status(500).json({ error: `An unexpected error occurred during scraping: ${error.message}` });
        }
    }
});

/**
 * @route GET /api/data
 * @description Fetches all previously scraped data from the database.
 * @returns {JSON} - An array of scraped items, or an error message.
 */
router.get('/data', (req, res) => {
    db.all(`SELECT * FROM scraped_items ORDER BY scraped_at DESC`, [], (err, rows) => {
        if (err) {
            console.error('Error fetching data from DB:', err.message);
            return res.status(500).json({ error: 'Failed to retrieve scraped data from database.' });
        }
        // If data is successfully retrieved, send it as a JSON response.
        res.status(200).json(rows);
    });
});
module.exports = router;
