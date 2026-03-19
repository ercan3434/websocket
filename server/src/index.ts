import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import cors from "cors";

const app = express();
app.use(cors({ origin: "*" }));

const server = createServer(app);
const wss = new WebSocketServer({ server });

const clients = new Set<WebSocket>();

let ledState = "OFF"; // 👈 STATE

wss.on("connection", (ws: WebSocket) => {
  clients.add(ws);

  // 👇 Yeni bağlantıya mevcut durumu gönder
  ws.send(JSON.stringify({ type: "STATE", value: ledState }));

  ws.on("message", (message) => {
    const msg = message.toString();
    console.log("Client mesaj:", msg);

    // 👇 Arduino state gönderdiyse herkese yay
    try {
      const data = JSON.parse(msg);

      if (data.type === "STATE") {
        ledState = data.value;

        clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        });
      }
    } catch (e) {}
  });

  ws.on("close", () => {
    clients.delete(ws);
  });
});

app.get("/", (req, res) => {
  return res.json({ success: true, message: "Sunucu çalışıyor" });
});

// REST endpoint
app.get("/command", (req, res) => {
  const command = req.query.cmd as string;

  console.log("Komut:", command);

  // 👇 state güncelle
  if (command === "TURN_ON") ledState = "ON";
  if (command === "TURN_OFF") ledState = "OFF";

  // 👇 tüm clientlara gönder
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "STATE",
          value: ledState,
        }),
      );
    }
  });

  res.json({ success: true });
});

server.listen(3001, () => {
  console.log("Server çalışıyor port 3001");
});
