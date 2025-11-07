FROM public.ecr.aws/docker/library/node:20.15.1-alpine3.20 AS base

FROM base AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM base AS production

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production && npm install core-js

COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD ["node", "dist/src/main.js"]
