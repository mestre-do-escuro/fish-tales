FROM node:22-bookworm-slim

WORKDIR /app

# Install all deps (dev deps included: the app runs through Vite).
COPY package.json package-lock.json* ./
RUN npm ci || npm install

COPY . .

ENV NODE_ENV=development \
    HOST=0.0.0.0 \
    PORT=8080

EXPOSE 8080

# Apply pending SQL migrations to DATABASE_URL, then start the app on 0.0.0.0:8080.
CMD ["sh", "-c", "npm run db:migrate && npm run dev"]
