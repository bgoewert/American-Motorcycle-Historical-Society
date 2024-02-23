FROM php:${PHP_VERSION:-8.2}-${PHP_VARIANT:-apache}
RUN docker-php-ext-install mysqli