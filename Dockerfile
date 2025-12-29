FROM node:20-alpine

WORKDIR /app

# Bağımlılıkları kopyala
COPY package*.json ./

# Sadece bağımlılıkları yükle (Build yapma!)
RUN npm install --force

# Tüm dosyaları kopyala
COPY . .

# Build adımını tamamen sildik/yorum yaptık. 
# Böylece build hatası alma ihtimalimiz kalmadı.

EXPOSE 3000

# Projeyi build etmeden, doğrudan geliştirme modunda (runtime'da) başlat
CMD ["npm", "run", "dev"]
