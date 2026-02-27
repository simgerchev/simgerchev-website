const fs = require("fs");
const http = require("http");
const path = require("path");
const express = require("express");
const WebSocket = require("ws");
const pty = require("node-pty");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: "/ws" });

const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

const homeDir = process.env.HOME || "/home/appuser";
const shellCandidates = ["/bin/bash", "/usr/bin/bash", "/bin/sh"];
const shellPath = shellCandidates.find((candidate) => fs.existsSync(candidate)) || "/bin/sh";

wss.on("connection", (ws) => {
  const ptyProcess = pty.spawn(shellPath, ["--login"], {
    name: "xterm-256color",
    cols: 80,
    rows: 24,
    cwd: homeDir,
    env: {
      ...process.env,
      TERM: "xterm-256color",
      LANG: "C.UTF-8",
      HOME: homeDir
    }
  });

  const sendData = (data) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "output", data }));
    }
  };

  ptyProcess.onData(sendData);

  ws.on("message", (message) => {
    let payload;
    try {
      payload = JSON.parse(message.toString());
    } catch (error) {
      return;
    }

    if (payload.type === "input" && typeof payload.data === "string") {
      ptyProcess.write(payload.data);
      return;
    }

    if (payload.type === "resize") {
      const cols = Number(payload.cols);
      const rows = Number(payload.rows);
      if (Number.isFinite(cols) && Number.isFinite(rows)) {
        ptyProcess.resize(cols, rows);
      }
    }
  });

  ws.on("close", () => {
    ptyProcess.kill();
  });

  ws.on("error", () => {
    ptyProcess.kill();
  });
});

const port = Number(process.env.PORT) || 8080;
server.listen(port, () => {
  console.log(`terminal server listening on :${port}`);
});

// Serve index.html for all unmatched routes (for SPA/rewrites)
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});
