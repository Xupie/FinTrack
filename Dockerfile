# api
FROM php:8.4.15-apache AS api
WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
  libzip-dev zip unzip libpng-dev libonig-dev libxml2-dev && \
  docker-php-ext-install mysqli

RUN a2enmod rewrite headers

EXPOSE 80

# web-dev
FROM node:22-slim AS web-dev
WORKDIR /usr/src/app/web

# Set environment
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV CI=true

RUN corepack enable

# Copy package files
COPY web/package.json web/pnpm-lock.yaml ./
RUN pnpm install

COPY web/src ./src
COPY web/public ./public
COPY web/next.config.ts ./
COPY web/tsconfig.json ./
COPY web/postcss.config.mjs ./
COPY web/tailwind.config.js ./

EXPOSE 3001

CMD ["pnpm", "dev"]

# web-prod
FROM node:22-slim AS web-prod
WORKDIR /usr/src/app/web

# Set environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable

# Copy package files
COPY web/package.json web/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Install dependencies
RUN pnpm run build

EXPOSE 3001
CMD ["sh", "-c", "pnpm install && pnpm run start"]
