# 1. Aşama: Bağımlılıkları yükle
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# pnpm kullanıldığı için corepack aktif ediyoruz
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml* ./
RUN pnpm i --frozen-lockfile

# 2. Aşama: Projeyi derle (Build)
FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# KRİTİK: Next.js build sırasında bu değişkenlerin tanımlı olması gerekir
ARG NEXT_PUBLIC_LIVEKIT_URL
ENV NEXT_PUBLIC_LIVEKIT_URL=${NEXT_PUBLIC_LIVEKIT_URL}

# Projeyi derle
RUN pnpm run build

# 3. Aşama: Çalışma ortamı (Runner)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Sadece gerekli dosyaları kopyalayarak imaj boyutunu küçültüyoruz
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# Uygulamayı başlat
CMD ["npm", "start"]
