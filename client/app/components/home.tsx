"use client";

import { useEffect, useState } from "react";

export default function HomeComponent() {
  const [ledState, setLedState] = useState<string | null>(null);

  useEffect(() => {
    // const socket = new WebSocket(`ws://${process.env.NEXT_PUBLIC_BASE_URL}`);
    const socket = new WebSocket(`wss://${process.env.NEXT_PUBLIC_BASE_URL}`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "STATE") {
        setLedState(data.value);
      }
    };

    return () => socket.close();
  }, []);

  const sendCommand = async (cmd: string) => {
    // await fetch(`http://${process.env.NEXT_PUBLIC_BASE_URL}/command?cmd=${cmd}`);
    await fetch(`https://${process.env.NEXT_PUBLIC_BASE_URL}/command?cmd=${cmd}`);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>IoT Led Kontrol</h1>

      <h2>
        Durum:{" "}
        <span style={{ color: ledState === "ON" ? "green" : ledState === "OFF" ? "red" : "gray" }}>
          {ledState ?? "Yükleniyor..."}
        </span>
      </h2>

      <button onClick={() => sendCommand("TURN_ON")}>Işığı Aç</button>

      <button onClick={() => sendCommand("TURN_OFF")}>Işığı Kapat</button>
    </div>
  );
}
