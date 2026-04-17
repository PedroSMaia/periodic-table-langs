# ── Build stage (install dependencies) ────────────────────────
FROM php:8.4-cli AS build

RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libjpeg-dev libfreetype6-dev \
    libonig-dev libxml2-dev libzip-dev libicu-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-configure intl \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip intl \
    && pecl install redis && docker-php-ext-enable redis \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader

COPY . .

# Optimize autoloader without running post-scripts (artisan needs DB/Redis at runtime, not build)
RUN COMPOSER_ALLOW_SUPERUSER=1 composer dump-autoload --optimize --no-scripts

# ── Production stage (PHP-FPM) ───────────────────────────────
FROM php:8.4-fpm

RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev libonig-dev \
    libxml2-dev libzip-dev libicu-dev default-mysql-client \
    cron nginx \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-configure intl \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip intl \
    && pecl install redis && docker-php-ext-enable redis \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# PHP production settings
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

WORKDIR /var/www/html

COPY --from=build /var/www/html /var/www/html

# Set permissions
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Add cron for scheduler (run as www-data)
RUN echo "* * * * * www-data cd /var/www/html && php artisan schedule:run >> /dev/null 2>&1" > /etc/cron.d/scheduler \
    && chmod 0644 /etc/cron.d/scheduler \
    && crontab -u www-data /etc/cron.d/scheduler

# Nginx config for backend API
COPY docker-nginx.conf /etc/nginx/sites-available/default

EXPOSE 8000

# Start cron + nginx + PHP-FPM
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
