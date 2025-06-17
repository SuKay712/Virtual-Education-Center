# ----- STAGE 1: BUILD -----
FROM node:20 AS builder

WORKDIR /app

# Cài dependency
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn và build
COPY . .
RUN npm run build

# ----- STAGE 2: RUNTIME -----
FROM node:20-slim

WORKDIR /app

# Cài đặt curl và timezone
RUN apt-get update && apt-get install -y curl tzdata && rm -rf /var/lib/apt/lists/* \
    && ln -fs /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime \
    && echo "Asia/Ho_Chi_Minh" > /etc/timezone \
    && dpkg-reconfigure -f noninteractive tzdata

# Copy dist và node_modules từ builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY .env ./

# Expose cổng mặc định
EXPOSE 3000

# Lệnh chạy app
CMD ["node", "dist/main.js"]
