# Deployment Guide

## Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-all
   ```
3. Start development servers:
   ```bash
   npm run dev
   ```
4. Open browser to:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api/health

## Vercel Deployment

### Automatic Deployment (Recommended)
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Deploy automatically using `vercel.json` configuration

### Manual Deployment
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Deploy:
   ```bash
   vercel
   ```

### Environment Variables for Production
Set these in Vercel dashboard:
- `NODE_ENV=production`
- `RATE_LIMIT_WINDOW=15`
- `RATE_LIMIT_MAX=100`

### Database Considerations
- **Development**: Uses local SQLite file
- **Production**: Uses in-memory SQLite (resets on restart)
- **Recommended**: Upgrade to persistent database service like:
  - Vercel Postgres
  - PlanetScale
  - Supabase

## Other Deployment Options

### Railway
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Render
1. Connect GitHub repository
2. Set build command: `npm run vercel-build`
3. Set start command: `npm start`

### Heroku
1. Create new app
2. Set buildpacks:
   - `heroku/nodejs`
3. Deploy from GitHub

## Performance Optimization

### Backend
- Enable compression middleware
- Add Redis for caching
- Implement database connection pooling

### Frontend
- Enable Vite build optimizations
- Add service worker for caching
- Implement code splitting

## Security Considerations

### Production Checklist
- [ ] Update CORS origins to actual domain
- [ ] Enable HTTPS
- [ ] Set secure headers
- [ ] Implement rate limiting
- [ ] Add input sanitization
- [ ] Enable logging and monitoring
