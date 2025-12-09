# api
FROM php:8.4.15-apache AS api
WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip libpng-dev libonig-dev libxml2-dev && \
    docker-php-ext-install mysqli

RUN a2enmod rewrite headers

EXPOSE 80

# web-development
FROM node:22-slim AS web-development
WORKDIR /usr/src/app/web

# Set environment
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

ARG PORT=3000

# Copy package files
COPY ./web/package.json ./web/package-lock.json* ./

# Install dependencies
RUN npm install --include=optional --verbose \
  && npm rebuild lightningcss --build-from-source --verbose

RUN npm install lightningcss-linux-x64-gnu

COPY /web .

EXPOSE 3001

CMD ["npm", "run", "dev"]
