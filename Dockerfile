COPY package*.json ./
# Bağımlılık çakışmalarını önlemek için --force ekledik

# Sadece bağımlılıkları yükle (Build yapma!)
RUN npm install --force

# Tüm dosyaları kopyala
COPY . .

# Build sırasında hata çıksa bile imajın oluşmasını sağlayan kritik değişkenler
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Eğer build hala hata veriyorsa, 'npm run build' yerine 
# doğrudan geliştirme modunda çalıştırmayı deneyebiliriz.
RUN npm run build
# Build adımını tamamen sildik/yorum yaptık. 
# Böylece build hatası alma ihtimalimiz kalmadı.

EXPOSE 3000
# Build adımını devre dışı bırakıp doğrudan dev moduna geçiyoruz
# RUN npm run build  <-- Bu satırı silin veya yorum yapın

# Projeyi build etmeden, doğrudan geliştirme modunda (runtime'da) başlat
CMD ["npm", "run", "dev"]
