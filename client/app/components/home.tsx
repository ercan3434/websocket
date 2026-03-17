"use client";

import { useRef, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "https://websocket-08mt.onrender.com";

type Point = { x: number; y: number };
type DrawData = { start: Point; end: Point; color: string };

export default function HomeComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [color, setColor] = useState<string>("");
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPositionRef = useRef<Point | null>(null);

  // 🔌 Socket bağlantısı
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"], // daha stabil
    });

    setSocket(newSocket);

    newSocket.on("init", ({ color: assignedColor, state }) => {
      setColor(assignedColor);
      state.forEach((drawData: DrawData) => {
        drawLine(drawData);
      });
    });

    newSocket.on("draw", (drawData: DrawData) => {
      drawLine(drawData);
    });

    newSocket.on("clear", () => {
      clearCanvasLocal();
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // ✏️ çizim fonksiyonu
  const drawLine = (drawData: DrawData) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.beginPath();
    context.strokeStyle = drawData.color;
    context.lineWidth = 2;
    context.lineCap = "round";
    context.moveTo(drawData.start.x, drawData.start.y);
    context.lineTo(drawData.end.x, drawData.end.y);
    context.stroke();
  };

  const getCanvasPoint = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // 🖱️ mouse events
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    lastPositionRef.current = getCanvasPoint(e);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !socket || !lastPositionRef.current) return;

    const newPoint = getCanvasPoint(e);

    const drawData: DrawData = {
      start: lastPositionRef.current,
      end: newPoint,
      color,
    };

    drawLine(drawData);
    socket.emit("draw", drawData);

    lastPositionRef.current = newPoint;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPositionRef.current = null;
  };

  // 🧹 temizleme
  const clearCanvasLocal = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const clearCanvas = () => {
    clearCanvasLocal();
    socket?.emit("clear");
  };

  return (
    <main style={{ textAlign: "center", padding: 20 }}>
      <h2>Canvas Collaboration (Your Color: {color})</h2>

      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: "2px solid black" }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />

      <div style={{ marginTop: 10 }}>
        <button onClick={clearCanvas} style={{cursor:"pointer"}}>Clear Canvas</button>
      </div>
    </main>
  );
}
