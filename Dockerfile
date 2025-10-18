# Build stage
FROM node:22.20.0-alpine3.22 AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN npx prisma generate

# Production stage
FROM node:22.20.0-alpine3.22 AS production

WORKDIR /usr/src/app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

COPY package*.json ./

RUN npm ci --only=production --ignore-scripts

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

RUN chown -R nodejs:nodejs /usr/src/app
USER nodejs

EXPOSE $SERVER_PORT

CMD ["npm", "run", "start"]
