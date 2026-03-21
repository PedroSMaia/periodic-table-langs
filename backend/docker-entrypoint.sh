#!/bin/bash
set -e

# Run migrations
php artisan migrate --force

# Cache configuration for performance
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Create storage link if not exists
php artisan storage:link 2>/dev/null || true

# Start cron daemon in background
cron

# Start PHP server
exec php artisan serve --host=0.0.0.0 --port=8000
