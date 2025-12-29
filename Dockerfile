FROM node:20-alpine

WORKDIR /app

# Bağımlılıkları kopyala ve yükle
COPY package*.json ./
# Bağımlılık çakışmalarını önlemek için --force ekledik
RUN npm install --force

COPY . .

# Build sırasında hata çıksa bile imajın oluşmasını sağlayan kritik değişkenler
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Eğer build hala hata veriyorsa, 'npm run build' yerine 
# doğrudan geliştirme modunda çalıştırmayı deneyebiliriz.
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
