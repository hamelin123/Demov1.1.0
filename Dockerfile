# ขั้นตอนการ Build
FROM node:18-alpine AS builder

# กำหนด Working Directory
WORKDIR /app

# คัดลอก package files
COPY package*.json ./

# ติดตั้ง build dependencies
RUN npm ci || npm install

# คัดลอก source code
COPY . .

# คอมไพล์ TypeScript
RUN npm run build || echo "Skip build step"

# ขั้นตอนการสร้าง Production Image
FROM node:18-alpine

# กำหนด Working Directory
WORKDIR /app

# คัดลอก package files
COPY package*.json ./

# ติดตั้ง Production Dependencies
RUN npm ci --only=production || npm install --production

# คัดลอก source code (ในกรณีที่ build ไม่ได้)
COPY . .

# เปิด Port
EXPOSE 5000

# ตั้งค่า Environment
ENV NODE_ENV=development
ENV DB_HOST=postgres
ENV DB_PORT=5432
ENV DB_USER=postgres
ENV DB_PASSWORD=postgres
ENV DB_NAME=coldchain_db

# คำสั่งรัน
CMD ["npm", "run", "dev"]