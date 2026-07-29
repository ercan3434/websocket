"use client";

import { useEffect, useState } from "react";
import styles from "./home.module.css";

export default function HomeComponent() {
  const [ledState, setLedState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let socket: WebSocket;

    const connect = (url: string, isFallback = false) => {
      socket = new WebSocket(url);

      socket.onopen = () => {
        console.log("Bağlandı:", url);
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "STATE") {
          setLedState(data.value);
        }
      };

      socket.onerror = () => {
        console.log("WebSocket hata:", url);
      };

      // BURAYA EKLE
      socket.onclose = (event) => {
        console.log("Bağlantı kapandı:", event.code);

        if (!isFallback && event.code === 1006) {
          console.log("Yedek sunucuya bağlanılıyor...");
          connect(`wss://${process.env.NEXT_PUBLIC_BASE_URL_2}`, true);
        }
      };
    };

    connect(`wss://${process.env.NEXT_PUBLIC_BASE_URL}`);

    return () => {
      socket?.close();
    };
  }, []);

  const sendCommand = async (cmd: string) => {
    setIsLoading(true);

    try {
      let response = await fetch(
        `https://${process.env.NEXT_PUBLIC_BASE_URL}/command?cmd=${cmd}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch {
      console.log("İlk sunucu başarısız, yedek sunucu deneniyor...");

      const response = await fetch(
        `https://${process.env.NEXT_PUBLIC_BASE_URL_2}/command?cmd=${cmd}`,
      );

      if (!response.ok) {
        throw new Error(`Yedek sunucu da başarısız: HTTP ${response.status}`);
      }
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
            <div
              className={`${styles.statusIndicator} ${isOn ? styles.on : styles.off}`}
            >
              <div className={styles.statusBadge}>
                {ledState ?? "Yükleniyor..."}
              </div>
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
          <p>
            Bağlantı Durumu: <span className={styles.connected}>Bağlı</span>
          </p>
        </div>
      </div>
    </div>
  );
}
