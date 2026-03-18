"use client";

import { useEffect, useState } from "react";

export default function HomeComponent() {
  const [ledState, setLedState] = useState("OFF");

  // const url = "10.6.228.86:3001"
  const url = "websocket-08mt.onrender.com";

  useEffect(() => {
    // const socket = new WebSocket(`ws://${url}`);
    const socket = new WebSocket(`wss://${url}`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "STATE") {
        setLedState(data.value);
      }
    };

    return () => socket.close();
  }, []);

  const sendCommand = async (cmd: string) => {
    // await fetch(`http://${url}/command?cmd=${cmd}`);
    await fetch(`https://${url}/command?cmd=${cmd}`);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>IoT Led Kontrol</h1>

      <h2>
        Durum:{" "}
        <span style={{ color: ledState === "ON" ? "green" : "red" }}>
          {ledState}
        </span>
      </h2>

      <button onClick={() => sendCommand("TURN_ON")}>Işığı Aç</button>

      <button onClick={() => sendCommand("TURN_OFF")}>Işığı Kapat</button>
    </div>
  );
}
