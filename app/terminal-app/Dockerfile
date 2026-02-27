FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm install --omit=dev \
  && npm cache clean --force

COPY . .

RUN useradd -m -u 10001 appuser \
  && chown -R appuser:appuser /app

USER appuser
ENV HOME=/home/appuser
ENV PORT=8080

EXPOSE 8080
CMD ["node", "server.js"]
