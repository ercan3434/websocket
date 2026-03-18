"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const ws = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // ws.current = new WebSocket("ws://10.6.228.86:3001");
    ws.current = new WebSocket("wss://websocket-08mt.onrender.com");

    ws.current.onopen = () => {
      console.log("WebSocket bağlandı");
      setConnected(true);
    };

    ws.current.onclose = () => {
      console.log("Bağlantı kapandı");
      setConnected(false);
    };

    ws.current.onerror = (err) => {
      console.error("WebSocket hata:", err);
    };

    ws.current.onmessage = (event) => {
      console.log("Server mesajı:", event.data);
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const sendCommand = (cmd: string) => {
    if (ws.current && connected) {
      ws.current.send(cmd);
    } else {
      console.log("Bağlantı yok");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>IoT Işık Kontrol (WebSocket)</h1>

      <p>Durum: {connected ? "🟢 Bağlı" : "🔴 Bağlı değil"}</p>

      <button onClick={() => sendCommand("TURN_ON")}>
        Işığı Aç
      </button>

      <button onClick={() => sendCommand("TURN_OFF")}>
        Işığı Kapat
      </button>
    </div>
  );
}