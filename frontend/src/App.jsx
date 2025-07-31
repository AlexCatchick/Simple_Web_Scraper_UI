import React, { useState, useEffect } from 'react';

// Main App component
const App = () => {
  // State variables to manage form inputs, scraped results, loading status, and messages.
  const [url, setUrl] = useState(''); // Stores the URL input by the user
  const [selector, setSelector] = useState(''); // Stores the CSS selector input by the user
  const [scrapedResult, setScrapedResult] = useState(''); // Stores the content from the last successful scrape
  const [scrapedHistory, setScrapedHistory] = useState([]); // Stores an array of previously scraped items
  const [loading, setLoading] = useState(false); // Boolean to indicate if an API call is in progress
  const [error, setError] = useState(''); // Stores any error messages from API calls
  const [message, setMessage] = useState(''); // Stores success messages from API calls

  // Backend API base URL. This should match the port your Node.js backend is running on.
  const API_BASE_URL = 'http://localhost:3001/api'; // Note the /api prefix for the routes

  // useEffect hook to fetch historical scraped data when the component mounts.
  // The empty dependency array `[]` ensures this runs only once after the initial render.
  useEffect(() => {
    fetchScrapedData();
  }, []);

  /**
   * Fetches all previously scraped data from the backend API.
   * Updates the `scrapedHistory` state.
   */
  const fetchScrapedData = async () => {
    try {
      setLoading(true); // Set loading to true while fetching
      const response = await fetch(`${API_BASE_URL}/data`); // Make GET request to the /api/data endpoint
      if (!response.ok) {
        // If the HTTP response status is not OK (e.g., 404, 500), throw an error.
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // Parse the JSON response
      setScrapedHistory(data); // Update the history state
    } catch (err) {
      console.error('Error fetching historical data:', err);
      setError('Failed to load historical data. Please ensure the backend is running.');
    } finally {
      setLoading(false); // Set loading to false once fetching is complete (success or failure)
    }
  };

  /**
   * Handles the form submission for scraping.
   * Sends the URL and selector to the backend's /api/scrape endpoint.
   * @param {Event} e - The form submission event.
   */
  const handleScrape = async (e) => {
    e.preventDefault(); // Prevent the default browser form submission behavior (page reload)
    setLoading(true); // Indicate loading state
    setError(''); // Clear previous errors
    setMessage(''); // Clear previous messages
    setScrapedResult(''); // Clear previous scraped result

    try {
      const response = await fetch(`${API_BASE_URL}/scrape`, {
        method: 'POST', // Use POST method for sending data
        headers: {
          'Content-Type': 'application/json', // Specify that the request body is JSON
        },
        body: JSON.stringify({ url, selector }), // Convert URL and selector to JSON string
      });

      const data = await response.json(); // Parse the JSON response from the backend

      if (!response.ok) {
        // If the backend response indicates an error, throw it.
        throw new Error(data.error || data.message || 'Something went wrong during scraping.');
      }

      setScrapedResult(data.content); // Display the newly scraped content
      setMessage(data.message); // Display success message
      fetchScrapedData(); // Refresh the historical data to include the new scrape
    } catch (err) {
      console.error('Scraping failed:', err);
      setError(err.message || 'An unknown error occurred during scraping.'); // Display the error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans text-gray-800 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      {/* Page Title */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-800 mb-8 mt-4 text-center">
        Web Scraper App
      </h1>

      {/* Scraping Form Section */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">Scrape New Data</h2>
        <form onSubmit={handleScrape} className="space-y-5">
          {/* URL Input */}
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              Target URL:
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g., https://example.com"
              required // HTML5 validation: field is required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out placeholder-gray-400"
            />
          </div>

          {/* Selector Input */}
          <div>
            <label htmlFor="selector" className="block text-sm font-medium text-gray-700 mb-1">
              CSS Selector:
            </label>
            <input
              type="text"
              id="selector"
              value={selector}
              onChange={(e) => setSelector(e.target.value)}
              placeholder="e.g., h1, .product-title, #main-content p"
              required // HTML5 validation: field is required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out placeholder-gray-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading} // Disable button when loading to prevent multiple submissions
            className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              // Loading spinner SVG
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Scrape Content' // Button text when not loading
            )}
          </button>
        </form>

        {/* Status Messages (Error and Success) */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
            Error: {error}
          </div>
        )}
        {message && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm text-center">
            {message}
          </div>
        )}

        {/* Display Last Scraped Result */}
        {scrapedResult && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Last Scraped Content:</h3>
            {/* `whitespace-pre-wrap` preserves line breaks, `break-words` handles long words */}
            <p className="text-gray-600 whitespace-pre-wrap break-words text-sm">{scrapedResult}</p>
          </div>
        )}
      </div>

      {/* Scraped History Section */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">Scraping History</h2>
        {loading && scrapedHistory.length === 0 ? (
          <p className="text-center text-gray-500">Loading history...</p>
        ) : scrapedHistory.length === 0 ? (
          <p className="text-center text-gray-500">No scraped data yet. Try scraping something!</p>
        ) : (
          <div className="space-y-4">
            {/* Map through the scrapedHistory array to display each item */}
            {scrapedHistory.map((item) => (
              <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                <p className="text-sm font-semibold text-indigo-600 mb-1">URL: <span className="font-normal text-gray-700 break-all">{item.url}</span></p>
                <p className="text-sm font-semibold text-indigo-600 mb-1">Selector: <span className="font-normal text-gray-700 break-all">{item.selector}</span></p>
                {/* Format the timestamp for better readability */}
                <p className="text-sm font-semibold text-indigo-600 mb-1">Scraped At: <span className="font-normal text-gray-700">{new Date(item.scraped_at).toLocaleString()}</span></p>
                <div className="mt-2 text-sm text-gray-600 bg-white p-3 rounded-md border border-gray-300 max-h-40 overflow-y-auto whitespace-pre-wrap break-words">
                  <span className="font-semibold">Content:</span> {item.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App; // Export the App component as the default export
