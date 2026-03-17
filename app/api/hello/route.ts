import { NextRequest } from "next/server";
import { WebSocketServer } from "ws";
import { createServer } from "http";

let wss: WebSocketServer | null = null;

// Bu handler sadece WebSocket server'ı başlatır
export async function GET(req: NextRequest) {
  // Vercel ortamında HTTP server almak mümkün değil, local için örnek:
  if (!wss) {
    const server = createServer((req, res) => {
      res.writeHead(200);
      res.end("WebSocket server is running!");
    });

    wss = new WebSocketServer({ server });

    wss.on("connection", (ws) => {
      console.log("Client connected");

      ws.on("message", (message) => {
        console.log("Received:", message.toString());

        // Gelen mesajı tüm clientlara geri gönder
        wss?.clients.forEach((client) => {
          if (client.readyState === ws.OPEN) {
            client.send(`Server received: ${message.toString()}`);
          }
        });
      });

      ws.on("close", () => {
        console.log("Client disconnected");
      });

      ws.send("Welcome to WebSocket server!");
    });

    server.listen(3001, () => {
      console.log("WebSocket server listening on port 3001");
    });
  }

  return new Response("WebSocket server initialized");
}