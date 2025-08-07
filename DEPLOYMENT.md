# FitSpace Forge - Deployment Guide

## 🚀 Deployment Overview

This guide covers deploying the FitSpace Forge e-commerce website to production. The website is built with React, TypeScript, and Vite, and is designed to work with the FitSpace Forge API.

## 📋 Prerequisites

- Node.js 18+ installed
- Access to the production API server
- Hosting platform (Netlify, Vercel, AWS S3, etc.) or Docker environment

## 🔧 Environment Configuration

### 1. Environment Variables

Create environment files for different environments:

**Development (.env.development):**
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_NAME=FitSpace Forge (Development)
VITE_APP_VERSION=1.0.0
```

**Production (.env.production):**
```env
VITE_API_BASE_URL=https://api.fitspaceforge.com
VITE_APP_NAME=FitSpace Forge
VITE_APP_VERSION=1.0.0
```

### 2. Required Environment Variables

- `VITE_API_BASE_URL`: Base URL of your API server
- `VITE_APP_NAME`: Application name (optional)
- `VITE_APP_VERSION`: Application version (optional)

## 📦 Build Process

### Development Build
```bash
npm run build:dev
```

### Production Build
```bash
npm run build:prod
```

### Preview Build Locally
```bash
npm run preview
```

## 🚢 Deployment Options

### Option 1: Static Hosting (Recommended)

#### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build:prod`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy!

#### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Vercel will auto-detect Vite configuration
3. Add environment variables in Vercel dashboard
4. Deploy!

#### AWS S3 + CloudFront
1. Build the project: `npm run build:prod`
2. Upload `dist` folder contents to S3 bucket
3. Configure CloudFront distribution
4. Set up Route 53 for custom domain

### Option 2: Docker Deployment

#### Build Docker Image
```bash
docker build -t fitspace-web .
```

#### Run with Docker
```bash
docker run -p 8080:80 fitspace-web
```

#### Deploy with Docker Compose
```bash
docker-compose up -d
```

### Option 3: Traditional Web Server

#### Upload Files
1. Build the project: `npm run build:prod`
2. Upload `dist` folder contents to your web server
3. Configure web server (see Nginx configuration below)

## 🔧 Server Configuration

### Nginx Configuration

The included `nginx.conf` provides:
- Gzip compression
- Static asset caching
- Security headers
- Client-side routing support
- Health check endpoint

Key features:
- Cache static assets for 1 year
- Proper MIME types
- Security headers (CSP, X-Frame-Options, etc.)
- Fallback to index.html for SPA routing

### Apache Configuration (.htaccess)

If using Apache, create a `.htaccess` file in the dist folder:

```apache
RewriteEngine On
RewriteBase /

# Handle client-side routing
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Set cache headers
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

## 🔒 Security Considerations

### Content Security Policy
The Nginx configuration includes a CSP header. Adjust as needed:

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.fitspaceforge.com;" always;
```

### HTTPS Configuration
- Always use HTTPS in production
- Update API URLs to use HTTPS
- Configure SSL certificates
- Set secure cookie flags in production

## 📊 Performance Optimization

### Build Optimizations
- Code splitting is configured in `vite.config.ts`
- Separate chunks for vendor libraries, UI components, and utilities
- Tree shaking removes unused code
- Asset optimization and compression

### Runtime Optimizations
- Gzip compression enabled
- Static asset caching (1 year)
- Lazy loading for routes
- Image optimization

## 🔍 Monitoring and Health Checks

### Health Check Endpoint
The deployment includes a `/health` endpoint that returns:
```
HTTP 200 OK
healthy
```

### Monitoring Setup
Consider setting up:
- Application performance monitoring (APM)
- Error tracking (Sentry, LogRocket)
- Analytics (Google Analytics, Mixpanel)
- Uptime monitoring

## 🚀 CI/CD Pipeline

### GitHub Actions
The included workflow (`.github/workflows/deploy.yml`) provides:
- Automated testing on pull requests
- Type checking and linting
- Automated production deployment on main branch

### Required Secrets
Set these in your GitHub repository settings:
- `VITE_API_BASE_URL`: Your production API URL

## 🔧 Troubleshooting

### Common Issues

#### 404 Errors on Refresh
- Ensure client-side routing is configured
- Check that fallback to index.html is working

#### API Connection Issues
- Verify `VITE_API_BASE_URL` is correct
- Check CORS configuration on API server
- Ensure API server is accessible from frontend

#### Build Failures
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check for TypeScript errors: `npm run type-check`
- Verify all environment variables are set

#### Performance Issues
- Enable gzip compression
- Check bundle size: `npm run analyze`
- Optimize images and assets
- Use CDN for static assets

## 📞 Support

For deployment issues:
1. Check this deployment guide
2. Review application logs
3. Check API connectivity
4. Contact development team

## 🎯 Post-Deployment Checklist

- [ ] Website loads correctly
- [ ] All pages are accessible
- [ ] API endpoints are working
- [ ] Authentication flow works
- [ ] Shopping cart functionality works
- [ ] Payment processing works (test mode first)
- [ ] All forms submit successfully
- [ ] Images and assets load correctly
- [ ] Mobile responsiveness works
- [ ] Performance is acceptable
- [ ] Security headers are set
- [ ] HTTPS is enabled
- [ ] Analytics are tracking
- [ ] Error monitoring is active

## 📝 Version History

- **v1.0.0** - Initial production release with full e-commerce functionality

---

*For technical support or questions about this deployment, contact the development team.*
