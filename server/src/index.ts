import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import cors from "cors";

const app = express();
app.use(cors({ origin: "*" }));

const server = createServer(app);
const wss = new WebSocketServer({ server });

const clients = new Set<WebSocket>();

wss.on("connection", (ws: WebSocket) => {
  console.log("Client bağlandı");

  clients.add(ws);

  ws.on("close", () => {
    console.log("Client ayrıldı");
    clients.delete(ws);
  });
});

// REST endpoint (Next.js buraya istek atacak)
app.get("/command", (req, res) => {
  const command = req.query.cmd as string;

  console.log("Komut:", command);

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(command);
    }
  });

  res.json({ success: true });
});

server.listen(3001, () => {
  console.log("Server çalışıyor: http://localhost:3001");
});