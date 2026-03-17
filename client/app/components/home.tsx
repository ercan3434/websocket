"use client";

import { useState } from "react";

export default function HomeComponent() {
  const [loading, setLoading] = useState(false);

  const sendCommand = async (cmd: string) => {
    setLoading(true);
    try {
      await fetch(`http://localhost:3001/command?cmd=${cmd}`);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>IoT Işık Kontrol</h1>

      <button onClick={() => sendCommand("TURN_ON")}>
        Işığı Aç
      </button>

      <button onClick={() => sendCommand("TURN_OFF")}>
        Işığı Kapat
      </button>

      {loading && <p>Gönderiliyor...</p>}
    </div>
  );
}