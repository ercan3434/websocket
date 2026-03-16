import { NextRequest } from "next/server";
import { Server as IOServer } from "socket.io";
import { createServer } from "http";
import { NextResponse } from "next/server";

// Next.js'de native HTTP server yok, Vercel gibi platformlarda API Route içinde socket.io doğrudan çalışmaz.
// Ama development için Node.js ortamında çalıştırmak istiyorsan custom server yapabilirsin.
// Burada örnek development için:

let io: IOServer;

export const GET = async (req: NextRequest) => {
  // Eğer io zaten varsa yeniden yaratma
  if (!io) {
    const httpServer = createServer();
    io = new IOServer(httpServer, {
      cors: { origin: "*", methods: ["GET", "POST"] },
    });

    const COLORS = ["red", "blue", "green", "purple", "orange"];
    let canvasState: any[] = [];
    let colorIndex = 0;

    io.on("connection", (socket) => {
      const color = COLORS[colorIndex++ % COLORS.length];

      // send initial state
      socket.emit("init", { state: canvasState, color });

      // handle drawing
      socket.on("draw", (drawData) => {
        const drawWithColor = { ...drawData, color };
        canvasState.push(drawWithColor);
        socket.broadcast.emit("draw", drawWithColor);
      });

      // handle canvas clear
      socket.on("clear", () => {
        canvasState = [];
        io.emit("clear");
      });
    });

    // Portu manuel aç (development için)
    httpServer.listen(3001, () =>
      console.log("Socket.IO dev server running on 3001"),
    );
  }

  return NextResponse.json({ message: "Socket.IO dev server started" });
};
