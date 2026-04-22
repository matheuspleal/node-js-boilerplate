# Build stage
FROM node:24.15.0-alpine3.23 AS builder

WORKDIR /usr/src/app

RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

RUN pnpm exec prisma generate

# Production stage
FROM node:24.15.0-alpine3.23 AS production

WORKDIR /usr/src/app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

RUN chown -R nodejs:nodejs /usr/src/app
USER nodejs

EXPOSE $SERVER_PORT

CMD ["pnpm", "run", "start"]
