FROM node:20-alpine as builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN npx prisma generate

COPY . .
EXPOSE 3001
RUN pnpm build

CMD ["pnpm", "start"]

