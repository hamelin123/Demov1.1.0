# ขั้นตอนการ Build
FROM node:18-alpine AS builder

# กำหนด Working Directory
WORKDIR /app

# คัดลอก package files
COPY package*.json ./

# ติดตั้ง build dependencies
RUN npm ci

# คัดลอก source code
COPY . .

# คอมไพล์ TypeScript
RUN npm run build

# ขั้นตอนการสร้าง Production Image
FROM node:18-alpine

# ติดตั้ง dumb-init เพื่อจัดการ Process
RUN apk add --no-cache dumb-init

# กำหนด User เพื่อความปลอดภัย
USER node

# กำหนด Working Directory
WORKDIR /app

# คัดลอก package files
COPY --from=builder /app/package*.json ./

# ติดตั้ง Production Dependencies
RUN npm ci --only=production

# คัดลอก Built files จาก Builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# เปิด Port
EXPOSE 5000

# ตั้งค่า Environment
ENV NODE_ENV=production

# คำสั่งรัน
CMD ["dumb-init", "node", "dist/index.js"]