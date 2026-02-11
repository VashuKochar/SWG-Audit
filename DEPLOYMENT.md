# Deployment Guide

Step-by-step guide for deploying SWG Audit to production (VPS, cloud, or bare metal).

## Prerequisites

- Linux server (Ubuntu 22.04+ or similar)
- Node.js 18+
- Domain name pointed to your server
- SSL certificate (Let's Encrypt recommended)

## 1. Server Setup

### Update system

```bash
sudo apt update && sudo apt upgrade -y
```

### Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

### Install PM2 (process manager)

```bash
sudo npm install -g pm2
```

### Create application user (optional but recommended)

```bash
sudo useradd -m -s /bin/bash swgaudit
sudo su - swgaudit
```

## 2. Clone and Build

```bash
git clone https://github.com/swgauditor/swgaudit.git
cd swgaudit
npm install
cp .env.example .env
```

### Configure environment

Edit `.env`:

```bash
nano .env
```

Required production settings:

```
PORT=3000
RECAPTCHA_SITE_KEY=your_actual_site_key
RECAPTCHA_SECRET_KEY=your_actual_secret_key
SESSION_SECRET=generate_a_strong_random_string_min_32_chars
SKIP_VERIFY=0
NODE_ENV=production
LOG_LEVEL=warn
GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Generate a strong session secret:**

```bash
openssl rand -base64 32
```

### Build

```bash
npm run build
```

## 3. Start with PM2

```bash
pm2 start server.js --name swg-audit
pm2 save
pm2 startup
```

Follow the instructions from `pm2 startup` to enable auto-start on boot.

## 4. Nginx Reverse Proxy

### Install Nginx

```bash
sudo apt install -y nginx
```

### Configure site

Create `/etc/nginx/sites-available/swgaudit`:

```nginx
server {
    listen 80;
    server_name www.swgaudit.com swgaudit.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.swgaudit.com swgaudit.com;

    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/swgaudit.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/swgaudit.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers (additional to helmet.js)
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options DENY always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logs
    access_log /var/log/nginx/swgaudit_access.log;
    error_log /var/log/nginx/swgaudit_error.log;

    # Reverse proxy to Node.js app
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static asset caching
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Enable site

```bash
sudo ln -s /etc/nginx/sites-available/swgaudit /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 5. SSL with Let's Encrypt

### Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Obtain certificate

```bash
sudo certbot --nginx -d swgaudit.com -d www.swgaudit.com
```

Follow prompts. Certbot will automatically configure Nginx for SSL.

### Auto-renewal

Certbot adds a renewal cron job automatically. Verify:

```bash
sudo certbot renew --dry-run
```

## 6. Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 7. Monitoring

### PM2 monitoring

```bash
pm2 monit
pm2 logs swg-audit
```

### Log rotation

PM2 handles log rotation automatically. Configure in PM2 ecosystem file if needed.

### System monitoring

Install `htop` or similar:

```bash
sudo apt install -y htop
```

## 8. Updates

### Pull latest code

```bash
cd ~/swgaudit
git pull origin main
npm install
npm run build
pm2 restart swg-audit
```

### Zero-downtime restart

```bash
pm2 reload swg-audit
```

## 9. Backup

### Automated backups

Create a cron job to backup:

- Application code (`/home/swgaudit/swgaudit`)
- Environment variables (`.env` — **store securely**)
- Logs (`/home/swgaudit/swgaudit/logs`)

Example backup script:

```bash
#!/bin/bash
BACKUP_DIR=/backup/swgaudit
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf $BACKUP_DIR/swgaudit_$DATE.tar.gz \
  -C /home/swgaudit swgaudit \
  --exclude=node_modules \
  --exclude=dist \
  --exclude=uploads
```

## 10. Security Checklist

- [ ] Strong session secret (32+ chars)
- [ ] SSL/TLS enabled (HTTPS only)
- [ ] Firewall configured
- [ ] Regular updates (OS, Node.js, dependencies)
- [ ] Non-root user for application
- [ ] reCAPTCHA v2 or v3 enabled
- [ ] Logs monitored
- [ ] Backups automated
- [ ] Rate limiting enabled (consider nginx limit_req)

## Troubleshooting

### Check PM2 status

```bash
pm2 status
pm2 logs swg-audit --lines 100
```

### Check Nginx logs

```bash
sudo tail -f /var/log/nginx/swgaudit_error.log
```

### Restart services

```bash
pm2 restart swg-audit
sudo systemctl restart nginx
```

### Health check

```bash
curl http://localhost:3000/health
```

Should return:

```json
{
  "status": "ok",
  "timestamp": "2026-02-11T18:00:00.000Z",
  "uptime": 123.456
}
```

## Production Optimization

### Enable gzip in Nginx (if not using Node.js compression)

Already handled by `compression` middleware in server.js.

### PM2 cluster mode (multi-core)

```bash
pm2 start server.js -i max --name swg-audit
```

### CDN (optional)

For global reach, consider Cloudflare or AWS CloudFront.

## Support

- Issues: [GitHub Issues](https://github.com/swgauditor/swgaudit/issues)
- Documentation: [README.md](README.md)
