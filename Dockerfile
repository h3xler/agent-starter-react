FROM node:20-alpine

# Gerekli sistem paketlerini yükle
RUN apk add --no-cache libc6-compat
WORKDIR /app

# pnpm kurulumu
RUN npm install -g pnpm

# Sadece paket dosyalarını kopyala ve bağımlılıkları yükle
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

# Tüm proje dosyalarını kopyala
COPY . .

# Build sırasında ve çalışma anında gerekli çevre değişkenleri
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Portu aç
EXPOSE 3000

# KRİTİK NOKTA: Build işlemini konteyner ayağa kalkarken yapıyoruz
# Önce build eder, başarılı olursa uygulamayı başlatır.
CMD ["sh", "-c", "pnpm build && pnpm start"]
