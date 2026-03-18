"use client";

import { useEffect, useState } from "react";

export default function HomeComponent() {
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("wss://websocket-08mt.onrender.com");
    // const socket = new WebSocket("ws://10.6.228.86:3001");

    socket.onopen = () => console.log("WebSocket bağlandı");
    socket.onmessage = (event) => console.log("Komut alındı:", event.data);
    socket.onclose = () => console.log("WebSocket kapandı");
    socket.onerror = (err) => console.error("WebSocket hata:", err);

    setWs(socket);

    return () => socket.close();
  }, []);

  const sendCommand = (cmd: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(cmd);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>IoT Işık Kontrol</h1>
      <button onClick={() => sendCommand("TURN_ON")}>Işığı Aç</button>
      <button onClick={() => sendCommand("TURN_OFF")}>Işığı Kapat</button>
    </div>
  );
}
