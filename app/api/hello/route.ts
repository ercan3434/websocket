import { NextRequest } from "next/server";
import { Server } from "socket.io";

export async function GET(req: NextRequest) {
  // @ts-ignore
  if (!global.io) {
    // @ts-ignore
    global.io = new Server({
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    // bağlantı eventleri
    // @ts-ignore
    global.io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("sendMessage", (msg: any) => {
        console.log("Received:", msg);
        // herkese geri gönder
        // @ts-ignore
        global.io.emit("newMessage", { from: socket.id, text: msg });
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }

  return new Response("Socket.io server running", { status: 200 });
}
