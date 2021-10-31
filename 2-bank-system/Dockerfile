FROM node:alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY .yarn .yarn
COPY .yarnrc.yml ./
COPY package.json yarn.lock ./
RUN yarn install --immutable --inline-builds

FROM node:alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_OPTIONS "--openssl-legacy-provider"

COPY . .
COPY --from=deps /app/.yarn/cache /app/.yarn/cache
COPY --from=deps /app/node_modules ./node_modules
RUN npx prisma generate
RUN yarn build && yarn install --immutable --mode=skip-build

FROM node:alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 3000

RUN npx prisma generate

CMD ["yarn", "start"]
