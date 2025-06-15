# ----- STAGE 1: BUILD -----
FROM node:20 AS builder

WORKDIR /app

# Cài dependency
COPY package*.json ./
RUN npm ci

# Copy toàn bộ mã nguồn và build
COPY . .
RUN npm run build

# ----- STAGE 2: RUNTIME -----
FROM node:20-slim

WORKDIR /app

# Copy dist và node_modules từ builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Expose cổng mặc định
EXPOSE 3000

# Lệnh chạy app
CMD ["node", "dist/main.js"]
