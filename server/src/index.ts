import express from "express";
import { createServer } from "http";
import WebSocket, { WebSocketServer } from "ws";

const app = express();
const server = createServer(app);
const port = process.env.PORT || 10000;

const wss = new WebSocketServer({
  server,
  path: "/ws",
});

// 🔥 En kritik düzeltme: intersection type
type AliveWebSocket = WebSocket & {
  isAlive: boolean;
};

wss.on("connection", (ws: WebSocket) => {
  const client = ws as AliveWebSocket;

  client.isAlive = true;

  client.on("error", console.error);

  client.on("pong", () => {
    client.isAlive = true;
  });

  client.on("message", (message: WebSocket.RawData) => {
    console.log("Received:", message.toString());

    client.send("Hello over WebSocket!");
  });
});

// Ping / Pong
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    const client = ws as AliveWebSocket;

    if (!client.isAlive) {
      return client.terminate();
    }

    client.isAlive = false;
    client.ping();
  });
}, 30000);

wss.on("close", () => {
  clearInterval(interval);
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
