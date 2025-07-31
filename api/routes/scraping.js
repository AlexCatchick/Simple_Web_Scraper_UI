const express = require('express');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const validator = require('validator');
const database = require('../database/database');

const router = express.Router();

/**
 * Scraping service utilities
 */
class ScrapingService {
    /**
     * Validate URL format
     * @param {string} url - URL to validate
     * @returns {boolean} - Whether URL is valid
     */
    static isValidUrl(url) {
        return validator.isURL(url, {
            protocols: ['http', 'https'],
            require_protocol: true
        });
    }

    /**
     * Validate CSS selector format
     * @param {string} selector - CSS selector to validate
     * @returns {boolean} - Whether selector is valid
     */
    static isValidCssSelector(selector) {
        try {
            // Basic validation - try to parse with cheerio
            const $ = cheerio.load('<div></div>');
            $(selector);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Scrape content using Cheerio (faster, for simple HTML)
     * @param {string} url - Target URL
     * @param {string} selector - CSS selector
     * @returns {Promise<Object>} - Scraped content result
     */
    static async scrapeWithCheerio(url, selector) {
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();
            const $ = cheerio.load(html);

            const elements = $(selector);

            if (elements.length === 0) {
                return {
                    success: false,
                    content: null,
                    error: 'No elements found with the provided selector'
                };
            }

            // Extract content from all matching elements
            const results = [];
            elements.each((index, element) => {
                const $element = $(element);
                results.push({
                    text: $element.text().trim(),
                    html: $element.html(),
                    attributes: element.attribs || {}
                });
            });

            return {
                success: true,
                content: results,
                count: results.length
            };

        } catch (error) {
            return {
                success: false,
                content: null,
                error: error.message
            };
        }
    }

    /**
     * Scrape content using Puppeteer (for JavaScript-heavy sites)
     * @param {string} url - Target URL
     * @param {string} selector - CSS selector or XPath
     * @param {string} selectorType - 'css' or 'xpath'
     * @returns {Promise<Object>} - Scraped content result
     */
    static async scrapeWithPuppeteer(url, selector, selectorType = 'css') {
        let browser = null;

        try {
            browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process',
                    '--disable-gpu'
                ]
            });

            const page = await browser.newPage();

            // Set user agent and viewport
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            await page.setViewport({ width: 1280, height: 720 });

            // Navigate to URL with timeout
            await page.goto(url, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            // Wait a bit for dynamic content to load
            await page.waitForTimeout(2000);

            let results;
            if (selectorType === 'xpath') {
                // Handle XPath selector
                results = await page.evaluate((xpath) => {
                    const elements = document.evaluate(
                        xpath,
                        document,
                        null,
                        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                        null
                    );

                    const results = [];
                    for (let i = 0; i < elements.snapshotLength; i++) {
                        const element = elements.snapshotItem(i);
                        results.push({
                            text: element.textContent?.trim() || '',
                            html: element.innerHTML || '',
                            tagName: element.tagName || '',
                            attributes: Array.from(element.attributes || []).reduce((acc, attr) => {
                                acc[attr.name] = attr.value;
                                return acc;
                            }, {})
                        });
                    }

                    return results;
                }, selector);
            } else {
                // Handle CSS selector
                results = await page.evaluate((cssSelector) => {
                    const elements = document.querySelectorAll(cssSelector);
                    const results = [];

                    elements.forEach((element) => {
                        results.push({
                            text: element.textContent?.trim() || '',
                            html: element.innerHTML || '',
                            tagName: element.tagName || '',
                            attributes: Array.from(element.attributes || []).reduce((acc, attr) => {
                                acc[attr.name] = attr.value;
                                return acc;
                            }, {})
                        });
                    });

                    return results;
                }, selector);
            }

            if (!results || results.length === 0) {
                return {
                    success: false,
                    content: null,
                    error: 'No elements found with the provided selector'
                };
            }

            return {
                success: true,
                content: results,
                count: results.length
            };

        } catch (error) {
            return {
                success: false,
                content: null,
                error: error.message
            };
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }
}

/**
 * POST /api/scrape
 * Main scraping endpoint
 */
router.post('/scrape', async (req, res) => {
    try {
        const { url, selector, selectorType = 'css', usePuppeteer = false } = req.body;

        // Validate required fields
        if (!url || !selector) {
            return res.status(400).json({
                success: false,
                error: 'URL and selector are required'
            });
        }

        // Validate URL format
        if (!ScrapingService.isValidUrl(url)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid URL format'
            });
        }

        // Validate CSS selector if not using XPath
        if (selectorType === 'css' && !ScrapingService.isValidCssSelector(selector)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid CSS selector format'
            });
        }

        let result;

        // Choose scraping method based on request or complexity
        if (usePuppeteer || selectorType === 'xpath') {
            result = await ScrapingService.scrapeWithPuppeteer(url, selector, selectorType);
        } else {
            result = await ScrapingService.scrapeWithCheerio(url, selector);
        }

        // Store result in database
        const dbRecord = {
            url,
            selector,
            selectorType,
            content: result.success ? JSON.stringify(result.content) : null,
            status: result.success ? 'success' : 'failed',
            errorMessage: result.error || null
        };

        try {
            await database.insertScrapingRecord(dbRecord);
        } catch (dbError) {
            console.error('Database error:', dbError);
            // Continue even if database fails
        }

        res.json(result);

    } catch (error) {
        console.error('Scraping error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error during scraping'
        });
    }
});

/**
 * GET /api/history
 * Get scraping history
 */
router.get('/history', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const history = await database.getScrapingHistory(limit);

        // Parse content JSON for successful results
        const processedHistory = history.map(record => ({
            ...record,
            content: record.content ? JSON.parse(record.content) : null
        }));

        res.json({
            success: true,
            data: processedHistory
        });

    } catch (error) {
        console.error('History retrieval error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve scraping history'
        });
    }
});

/**
 * DELETE /api/history/:id
 * Delete specific history entry
 */
router.delete('/history/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                error: 'Invalid ID provided'
            });
        }

        const result = await database.deleteScrapingRecord(parseInt(id));

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                error: 'Record not found'
            });
        }

        res.json({
            success: true,
            message: 'Record deleted successfully'
        });

    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete record'
        });
    }
});

module.exports = router;
