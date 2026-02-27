const statusEl = document.getElementById("status");
const terminalEl = document.getElementById("terminal");

const term = new Terminal({
  cursorBlink: true,
  fontFamily: "'Courier New', Courier, monospace",
  fontSize: 15,
  theme: {
    background: "#0b0e14",
    foreground: "#e6e6e6",
    cursor: "#f6c177",
    selection: "rgba(246, 193, 119, 0.25)"
  }
});

const fitAddon = new FitAddon.FitAddon();
term.loadAddon(fitAddon);
term.open(terminalEl);

const socketUrl = `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws`;
const socket = new WebSocket(socketUrl);

const updateStatus = (text, isLive) => {
  statusEl.textContent = text;
  statusEl.dataset.live = isLive ? "true" : "false";
};

socket.addEventListener("open", () => {
  updateStatus("connected", true);
  fitAddon.fit();
  const dims = fitAddon.proposeDimensions();
  if (dims) {
    socket.send(JSON.stringify({ type: "resize", cols: dims.cols, rows: dims.rows }));
  }
});

socket.addEventListener("close", () => {
  updateStatus("disconnected", false);
});

socket.addEventListener("error", () => {
  updateStatus("error", false);
});

socket.addEventListener("message", (event) => {
  let payload;
  try {
    payload = JSON.parse(event.data);
  } catch (error) {
    return;
  }

  if (payload.type === "output" && typeof payload.data === "string") {
    term.write(payload.data);
  }
});

term.onData((data) => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "input", data }));
  }
});

const resizeTerminal = () => {
  fitAddon.fit();
  const dims = fitAddon.proposeDimensions();
  if (dims && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "resize", cols: dims.cols, rows: dims.rows }));
  }
};

const resizeObserver = new ResizeObserver(resizeTerminal);
resizeObserver.observe(terminalEl);

window.addEventListener("beforeunload", () => {
  resizeObserver.disconnect();
});
