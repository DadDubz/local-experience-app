#!/bin/bash

# Production deployment script
echo "Starting deployment..."

# Pull latest changes
git pull origin main

# Install dependencies
npm install --production

# Build application
npm run build

# Update environment variables
source .env.production

# Restart PM2 processes
pm2 restart ecosystem.config.js --env production

echo "Deployment completed!"