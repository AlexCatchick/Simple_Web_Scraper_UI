# Web Scraper Application

A full-stack web scraper application built with React.js frontend and Node.js backend, designed for deployment on Vercel.

## Features

- **User-friendly Interface**: Clean, responsive UI built with React and Tailwind CSS
- **Flexible Scraping**: Support for CSS selectors and XPath expressions
- **Data Persistence**: SQLite database for storing scraping history
- **Real-time Results**: Instant display of scraped content
- **Error Handling**: Comprehensive validation and error management
- **Vercel Ready**: Optimized for serverless deployment

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios for API calls

### Backend
- Node.js
- Express.js
- Cheerio & Puppeteer for web scraping
- SQLite for database
- CORS and security middleware

## Project Structure

```
web-scraper/
├── api/                    # Backend serverless functions
│   ├── server.js          # Main server file
│   ├── routes/            # API routes
│   └── database/          # Database utilities
├── client/                # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── package.json           # Root package.json
└── vercel.json           # Vercel configuration
```

## Installation

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-all
   ```

3. Start development servers:
   ```bash
   npm run dev
   ```

### Vercel Deployment

1. Push to GitHub repository
2. Connect to Vercel
3. Deploy automatically with the included `vercel.json` configuration

## Environment Variables

Create a `.env` file in the root directory:

```
NODE_ENV=production
DATABASE_URL=./database/scraper.db
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

## API Endpoints

- `POST /api/scrape` - Scrape content from a URL
- `GET /api/history` - Get scraping history
- `DELETE /api/history/:id` - Delete specific history entry

## Usage

1. Enter a website URL
2. Provide a CSS selector (e.g., `.title`, `#content`) or XPath expression
3. Click "Scrape Content"
4. View results and scraping history

## Security Features

- Rate limiting
- Input validation
- CORS protection
- Helmet security headers
- SQL injection prevention

## License

MIT License
