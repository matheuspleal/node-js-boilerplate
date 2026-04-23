# Base stage
FROM node:24.15.0-slim AS base

WORKDIR /usr/src/app

RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml ./

# Development stage
FROM base AS development

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

RUN pnpm exec prisma generate

EXPOSE $SERVER_PORT

CMD ["pnpm", "run", "start:dev"]

# Production dependencies stage
FROM base AS prod-deps

RUN pnpm install --frozen-lockfile --prod --ignore-scripts

# Build stage
FROM base AS builder

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

RUN pnpm run build

RUN pnpm exec prisma generate

# Production stage
FROM gcr.io/distroless/nodejs24-debian12:nonroot AS production

WORKDIR /usr/src/app

COPY --from=builder --chown=nonroot:nonroot /usr/src/app/dist ./dist
COPY --from=prod-deps --chown=nonroot:nonroot /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=nonroot:nonroot /usr/src/app/src/core/infra/repositories/prisma/generated ./src/core/infra/repositories/prisma/generated

EXPOSE $SERVER_PORT

CMD ["dist/server.js"]
