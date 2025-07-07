const sqlite3 = require('sqlite3').verbose(); // Import sqlite3 in verbose mode for more detailed logging

// Path to the database file. This file will be created in the web-scraper-backend directory.
const DB_PATH = './scraped_data.db';

// Initialize SQLite database connection
// The callback function is executed once the database is opened.
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        // If there's an error opening the database, log it and exit the process
        // as the database is a critical component.
        console.error('Error opening database:', err.message);
        process.exit(1);
    } else {
        console.log('Connected to the SQLite database.');
        // Create the 'scraped_items' table if it doesn't already exist.
        // This table will store the URL, selector used, scraped content, and timestamp.
        db.run(`CREATE TABLE IF NOT EXISTS scraped_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            selector TEXT NOT NULL,
            content TEXT NOT NULL,
            scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                // If table creation fails, log the error and exit.
                console.error('Error creating table:', err.message);
                process.exit(1);
            } else {
                console.log('Table "scraped_items" created or already exists.');
            }
        });
    }
});

/**
 * Function to close the database connection.
 * It's important to close database connections to prevent resource leaks.
 * @param {function} callback - An optional callback function to execute after the database is closed.
 */
const closeDb = (callback) => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        }
        if (callback) {
            callback(); // Execute the callback if provided
        }
    });
};

// Export the database instance ('db') and the 'closeDb' function
// so they can be imported and used in other parts of the application (e.g., routes).
module.exports = { db, closeDb };
