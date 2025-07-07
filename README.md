# Simple Web Scraper UI

This project provides a simple web-based user interface for scraping data from websites. Built primarily with JavaScript, it allows users to input URLs and extract relevant information easily.

## Project Structure
```
web-scraping-app/
├── web-scraper-backend/
│   ├── server.js             # Main backend application entry point
│   ├── db.js                 # Database connection and initialization
│   ├── routes/
│   │   └── scrapeRoutes.js   # API routes for scraping and data retrieval
│   └── utils/
│       └── scraper.js        # Core web scraping logic (Axios & Cheerio)
│   ├── package.json
│   └── scraped_data.db       # SQLite database file (generated on first run)
│
└── web-scraper-frontend/
    ├── public/
    ├── src/
    │   ├── App.js            # Main React component
    │   └── index.css         # Global CSS with Tailwind directives
    ├── tailwind.config.js    # Tailwind CSS configuration
    ├── postcss.config.js     # PostCSS configuration for Tailwind
    ├── package.json
    └── ... (other React project files)
```

- **src/**: Source code including JavaScript files and UI components  
- **public/**: Static assets and the main HTML file  
- **styles/**: CSS files for styling  
- **package.json**: Project metadata and dependencies

---
