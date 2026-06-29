FROM php:8.2-fpm

# === ARG untuk sinkron UID/GID host ===
ARG APP_UID=1000
ARG APP_GID=1000

# === Install system deps + PHP extensions ===
RUN apt-get update && apt-get install -y \
    unzip \
    git \
    curl \
    libzip-dev \
    libicu-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libpq-dev \
    zip \
    && docker-php-ext-configure zip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        zip \
        intl \
        pdo_pgsql \
        gd \
        opcache \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# === Buat user & group sesuai host ===
RUN groupadd -g ${APP_GID} appgroup \
    && useradd -u ${APP_UID} -g appgroup -m appuser

# === Set permission folder kerja ===
WORKDIR /var/www/html
RUN chown -R appuser:appgroup /var/www

# === Gunakan user non-root ===
USER appuser

EXPOSE 9000
CMD ["php-fpm"]