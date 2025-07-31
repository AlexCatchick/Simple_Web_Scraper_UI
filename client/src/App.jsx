import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

/**
 * Main Web Scraper Application Component
 * Provides interface for scraping websites and viewing results
 */
function App() {
  // Form state
  const [url, setUrl] = useState('');
  const [selector, setSelector] = useState('');
  const [selectorType, setSelectorType] = useState('css');
  const [usePuppeteer, setUsePuppeteer] = useState(false);

  // Results and UI state
  const [scrapingResult, setScrapingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // API base URL - adjust for your deployment
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  /**
   * Load scraping history on component mount
   */
  useEffect(() => {
    loadHistory();
  }, []);

  /**
   * Load scraping history from API
   */
  const loadHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/history`);
      if (response.data.success) {
        setHistory(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  /**
   * Validate form inputs
   */
  const validateForm = () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return false;
    }

    if (!selector.trim()) {
      setError('Please enter a CSS selector or XPath');
      return false;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL (include http:// or https://)');
      return false;
    }

    return true;
  };

  /**
   * Handle form submission for scraping
   */
  const handleScrape = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setScrapingResult(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/scrape`, {
        url: url.trim(),
        selector: selector.trim(),
        selectorType,
        usePuppeteer
      });

      setScrapingResult(response.data);

      // Reload history to show the new entry
      loadHistory();

    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Failed to scrape content. Please check your inputs and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear form and results
   */
  const handleClear = () => {
    setUrl('');
    setSelector('');
    setSelectorType('css');
    setUsePuppeteer(false);
    setScrapingResult(null);
    setError('');
  };

  /**
   * Delete a history entry
   */
  const deleteHistoryEntry = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/history/${id}`);
      loadHistory();
    } catch (err) {
      console.error('Failed to delete history entry:', err);
    }
  };

  /**
   * Load a history entry into the form
   */
  const loadHistoryEntry = (entry) => {
    setUrl(entry.url);
    setSelector(entry.selector);
    setSelectorType(entry.selector_type);
    setScrapingResult({
      success: entry.status === 'success',
      content: entry.content,
      error: entry.error_message
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Web Scraper
          </h1>
          <p className="text-gray-600">
            Extract content from any website using CSS selectors or XPath expressions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Scraping Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Scrape Content
            </h2>

            <form onSubmit={handleScrape} className="space-y-4">
              {/* URL Input */}
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Selector Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selector Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="css"
                      checked={selectorType === 'css'}
                      onChange={(e) => setSelectorType(e.target.value)}
                      className="mr-2"
                    />
                    CSS Selector
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="xpath"
                      checked={selectorType === 'xpath'}
                      onChange={(e) => setSelectorType(e.target.value)}
                      className="mr-2"
                    />
                    XPath
                  </label>
                </div>
              </div>

              {/* Selector Input */}
              <div>
                <label htmlFor="selector" className="block text-sm font-medium text-gray-700 mb-2">
                  {selectorType === 'css' ? 'CSS Selector' : 'XPath Expression'}
                </label>
                <input
                  type="text"
                  id="selector"
                  value={selector}
                  onChange={(e) => setSelector(e.target.value)}
                  placeholder={
                    selectorType === 'css'
                      ? 'e.g., .title, #content, h1'
                      : 'e.g., //h1[@class="title"]'
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Advanced Options */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={usePuppeteer}
                    onChange={(e) => setUsePuppeteer(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    Use Puppeteer (for JavaScript-heavy sites)
                  </span>
                </label>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              {/* Form Actions */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Scraping...' : 'Scrape Content'}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>

          {/* Results Display */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Results
              </h2>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                {showHistory ? 'Hide History' : 'Show History'}
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <span className="ml-2 text-gray-600">Scraping content...</span>
              </div>
            )}

            {/* Scraping Results */}
            {scrapingResult && !loading && (
              <div className="space-y-4">
                {scrapingResult.success ? (
                  <div>
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
                      ✅ Successfully scraped {scrapingResult.count} element(s)
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {scrapingResult.content?.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-md p-3">
                          <div className="text-sm text-gray-500 mb-2">Element {index + 1}</div>
                          <div className="bg-gray-50 p-3 rounded text-sm">
                            <strong>Text:</strong> {item.text || 'No text content'}
                          </div>
                          {item.html && (
                            <details className="mt-2">
                              <summary className="cursor-pointer text-sm text-indigo-600">
                                View HTML
                              </summary>
                              <pre className="bg-gray-50 p-3 rounded text-xs mt-2 overflow-x-auto">
                                {item.html}
                              </pre>
                            </details>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    ❌ {scrapingResult.error}
                  </div>
                )}
              </div>
            )}

            {/* History */}
            {showHistory && (
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Scraping History
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-gray-500 text-sm">No history available</p>
                  ) : (
                    history.map((entry) => (
                      <div key={entry.id} className="bg-gray-50 p-3 rounded-md text-sm">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-gray-800 truncate">
                              {entry.url}
                            </div>
                            <div className="text-gray-600">
                              {entry.selector} ({entry.selector_type})
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(entry.timestamp).toLocaleString()}
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-2">
                            <button
                              onClick={() => loadHistoryEntry(entry)}
                              className="text-indigo-600 hover:text-indigo-800 text-xs"
                            >
                              Load
                            </button>
                            <button
                              onClick={() => deleteHistoryEntry(entry.id)}
                              className="text-red-600 hover:text-red-800 text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className={`mt-1 text-xs ${entry.status === 'success' ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {entry.status === 'success' ? '✅ Success' : '❌ Failed'}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Initial State */}
            {!scrapingResult && !loading && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-4">🔍</div>
                <p>Enter a URL and selector above to start scraping</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Built with React, Node.js, and Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}

export default App;
