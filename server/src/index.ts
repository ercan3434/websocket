import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import cors from "cors";

const app = express();
app.use(cors({ origin: "*" }));

const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

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

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});