FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat curl python3 make g++ && npm install -g node-gyp
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --frozen-lockfile --prefer-offline

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate && npm run build

FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/src/scripts ./src/scripts
COPY .env.docker ./.env

# Install tsx for running TypeScript scripts in production
RUN npm install -g tsx

RUN chmod +x ./src/scripts/init.sh && mkdir -p /app/data && chown -R nextjs:nodejs /app/data && chmod 755 /app/data

USER nextjs
EXPOSE 3003
ENV PORT=3003 HOSTNAME="0.0.0.0"

CMD ["./src/scripts/init.sh"]