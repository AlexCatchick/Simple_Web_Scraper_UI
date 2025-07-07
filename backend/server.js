const express = require('express');
const cors = require('cors');
const { db, closeDb } = require('./db');
const scrapeRoutes = require('./routes/scrapeRoutes');

const app = express();
const PORT = 3001;
app.use(cors());

app.use(express.json());

app.use('/api', scrapeRoutes);

// Basic route for testing server status
// When you visit http://localhost:3001/ in your browser, you'll see this message.
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Web Scraper Backend is running!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    // console.log('\nTo run this refactored backend:');
    // console.log('1. Ensure you are in the `web-scraper-backend` directory.');
    // console.log('2. Run `npm install express axios cheerio sqlite3 cors` if you haven\'t already.');
    // console.log('3. Make sure you have the correct file structure as described in the documentation.');
    // console.log('4. Run `node server.js`');
});

// Gracefully close the database connection on server shutdown
// This ensures that the SQLite database file is properly closed when the server is stopped (e.g., Ctrl+C).
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    closeDb(() => {
        console.log('Database connection closed.');
        // Exit the process after the database connection is closed.
        process.exit(0);
    });
});
