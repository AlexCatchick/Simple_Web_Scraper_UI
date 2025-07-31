
const axios = require('axios'); // Axios for making HTTP requests to fetch web page content
const cheerio = require('cheerio'); // Cheerio for parsing and manipulating HTML (like jQuery)

/**
 * Scrapes text content from a given URL using a specified CSS selector.
 * @param {string} url - The URL of the webpage to fetch.
 * @param {string} selector - The CSS selector to target the desired elements within the HTML.
 * @returns {Promise<string|null>} - A Promise that resolves with the extracted text content.
 * Returns null if no content is found for the selector,
 * or throws an error if fetching/parsing fails.
 */
async function scrapeContent(url, selector) {
    try {
        // Fetch the HTML content of the page using Axios.
        // A User-Agent header is added to mimic a real browser request, which can help
        // bypass some basic anti-scraping measures.
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const htmlData = response.data; // Get the HTML content from the response

        // Load the HTML into Cheerio. This creates a Cheerio object that allows
        // you to use jQuery-like syntax to traverse and manipulate the DOM.
        const $ = cheerio.load(htmlData);

        // Extract text content based on the provided CSS selector.
        // '.text()' gets the combined text content of all matched elements.
        // '.trim()' removes whitespace from both ends of the string.
        const extractedContent = $(selector).text().trim();

        // Return the extracted content. If no content is found (e.g., selector doesn't match),
        // it will return an empty string, so we explicitly return null in that case.
        return extractedContent || null;
    } catch (error) {
        // Log the specific error for debugging purposes.
        console.error(`Error scraping ${url} with selector ${selector}:`, error.message);
        // Re-throw the error so it can be caught and handled by the calling function (e.g., in scrapeRoutes.js).
        throw error;
    }
}

// Export the scraping function so it can be imported and used by other modules.
module.exports = scrapeContent;
