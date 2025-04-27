# ใช้ Node.js base image
FROM node:18

# ตั้ง working directory
WORKDIR /usr/src/app

# คัดลอก package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์ทั้งหมด
COPY . .

# เปิดพอร์ต
EXPOSE 5000

# สั่งให้รันแอป
CMD ["npm", "run", "dev"]
