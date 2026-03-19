"use client";

import { useEffect, useState } from "react";
import styles from "./home.module.css";

export default function HomeComponent() {
  const [ledState, setLedState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    try {
      // await fetch(`http://${process.env.NEXT_PUBLIC_BASE_URL}/command?cmd=${cmd}`);
      await fetch(`https://${process.env.NEXT_PUBLIC_BASE_URL}/command?cmd=${cmd}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isOn = ledState === "ON";

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>IoT Kontrol</h1>
        </div>

        {/* Status Card */}
        <div className={styles.statusCard}>
          <div className={styles.statusContent}>
            <p className={styles.statusLabel}>Durum</p>
            <div className={`${styles.statusIndicator} ${isOn ? styles.on : styles.off}`}>
              <div className={styles.statusBadge}>{ledState ?? "Yükleniyor..."}</div>
            </div>
          </div>

          {ledState && (
            <p className={styles.statusDescription}>
              <strong>{isOn ? "AÇIK" : "KAPALI"}</strong>
            </p>
          )}
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => sendCommand("TURN_ON")}
            disabled={isLoading || ledState === "ON"}
          >
            <span className={styles.btnIcon}>💡</span>
            Aç
          </button>

          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => sendCommand("TURN_OFF")}
            disabled={isLoading || ledState === "OFF"}
          >
            <span className={styles.btnIcon}>⚫</span>
            Kapat
          </button>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <p>Bağlantı Durumu: <span className={styles.connected}>Bağlı</span></p>
        </div>
      </div>
    </div>
  );
}
