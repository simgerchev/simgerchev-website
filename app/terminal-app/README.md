# Terminal App

Browser-based bash terminal using xterm.js, node-pty, and WebSockets.

## Run locally

```bash
npm install
npm start
```

Open http://localhost:8080

## Run with Docker

```bash
docker build -t terminal-app .
docker run --rm -p 8080:8080 terminal-app
```

## Run with Docker Compose

```bash
docker compose up --build
```

Open http://localhost:8080
