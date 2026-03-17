import { NextApiRequest } from "next";
import { Server } from "socket.io";

export default function handler(req: NextApiRequest, res: any) {
  if (!res.socket.server.io) {
    console.log("Starting Socket.io server...");
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("sendMessage", (msg) => {
        console.log("Received:", msg);
        // herkese geri gönder
        io.emit("newMessage", { from: socket.id, text: msg });
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}
