# Website Marketplace - Deployment Guide

## Prerequisites

Before deploying, make sure you have:

1. **Node.js** (v18 or higher)
2. **MongoDB** database (local or cloud)
3. **Cloudinary** account for image storage
4. **Stripe** account for payments
5. **Email service** (Gmail, SendGrid, etc.)

## Environment Setup

### 1. Create Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DB_URL=mongodb://localhost:27017/website-marketplace
# or for MongoDB Atlas:
# DB_URL=mongodb+srv://username:password@cluster.mongodb.net/website-marketplace

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password

# App
PORT=3000
NODE_ENV=production
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Application

```bash
npm run build
```

## Local Development

### Start Development Server

```bash
npm run start:dev
```

The application will be available at `http://localhost:3000`

### Start Production Server

```bash
npm run start:prod
```

## Cloud Deployment

### Option 1: Heroku

1. **Install Heroku CLI**
2. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set DB_URL=your-mongodb-url
   heroku config:set JWT_SECRET=your-jwt-secret
   heroku config:set CLOUDINARY_CLOUD_NAME=your-cloud-name
   heroku config:set CLOUDINARY_API_KEY=your-api-key
   heroku config:set CLOUDINARY_API_SECRET=your-api-secret
   heroku config:set STRIPE_SECRET_KEY=your-stripe-secret
   heroku config:set EMAIL_HOST=your-email-host
   heroku config:set EMAIL_USER=your-email-user
   heroku config:set EMAIL_PASS=your-email-password
   heroku config:set NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 2: Railway

1. **Connect your GitHub repository to Railway**
2. **Set environment variables in Railway dashboard**
3. **Deploy automatically on push**

### Option 3: DigitalOcean App Platform

1. **Create a new app in DigitalOcean**
2. **Connect your GitHub repository**
3. **Set environment variables**
4. **Deploy**

### Option 4: AWS EC2

1. **Launch EC2 instance**
2. **Install Node.js and PM2**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

3. **Clone and setup project**
   ```bash
   git clone your-repo-url
   cd your-project
   npm install
   npm run build
   ```

4. **Start with PM2**
   ```bash
   pm2 start dist/main.js --name "website-marketplace"
   pm2 startup
   pm2 save
   ```

5. **Setup Nginx reverse proxy**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Database Setup

### MongoDB Atlas (Recommended for Production)

1. **Create MongoDB Atlas account**
2. **Create a new cluster**
3. **Create database user**
4. **Get connection string**
5. **Add IP whitelist**

### Local MongoDB

```bash
# Install MongoDB
sudo apt-get install mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring and Logs

### PM2 Monitoring

```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs

# Restart application
pm2 restart website-marketplace
```

### Application Logs

```bash
# View application logs
tail -f logs/app.log

# View error logs
tail -f logs/error.log
```

## Backup Strategy

### Database Backup

```bash
# MongoDB backup
mongodump --uri="your-mongodb-connection-string" --out=backup/

# Restore
mongorestore --uri="your-mongodb-connection-string" backup/
```

### Automated Backup Script

Create `backup.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="your-mongodb-connection-string" --out=backup/$DATE
tar -czf backup/$DATE.tar.gz backup/$DATE
rm -rf backup/$DATE
```

## Security Considerations

1. **Use strong JWT secrets**
2. **Enable CORS properly**
3. **Validate all inputs**
4. **Use HTTPS in production**
5. **Regular security updates**
6. **Database access restrictions**
7. **API rate limiting**

## Performance Optimization

1. **Enable compression**
2. **Use caching strategies**
3. **Optimize database queries**
4. **Use CDN for static assets**
5. **Implement pagination**
6. **Monitor performance metrics**

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   lsof -i :3000
   kill -9 <PID>
   ```

2. **MongoDB connection issues**
   - Check connection string
   - Verify network access
   - Check authentication

3. **Environment variables not loading**
   - Verify `.env` file exists
   - Check variable names
   - Restart application

### Health Check Endpoint

Add a health check endpoint to monitor application status:

```typescript
@Get('health')
async healthCheck() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };
}
```

## Support

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Test database connectivity
4. Check network configuration
5. Review security group settings 