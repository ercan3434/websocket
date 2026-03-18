"use client";

import { useEffect, useRef } from "react";

export default function HomeComponent() {
  const WS_URL = "wss://websocket-08mt.onrender.com/ws";

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);

  const maxReconnectAttempts = 10;
  const baseBackoffDelay = 1000;

  const pingInterval = useRef<NodeJS.Timeout | null>(null);
  const pongTimeout = useRef<NodeJS.Timeout | null>(null);

  const connect = () => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Connected to server");
      reconnectAttempts.current = 0;
      startPinging();
    };

    ws.onmessage = (event: MessageEvent) => {
      if (event.data === "pong") {
        if (pongTimeout.current) clearTimeout(pongTimeout.current);
        return;
      }

      console.log("Received:", event.data);
    };

    ws.onclose = (event: CloseEvent) => {
      console.log(`Connection closed: ${event.code} ${event.reason}`);
      cleanup();
      handleReconnect();
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  };

  const startPinging = () => {
    pingInterval.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send("ping");

        pongTimeout.current = setTimeout(() => {
          console.log("No pong received, closing connection");
          wsRef.current?.close();
        }, 10000);
      }
    }, 30000);
  };

  const handleReconnect = () => {
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      return;
    }

    reconnectAttempts.current++;

    const delay = Math.min(
      baseBackoffDelay * Math.pow(2, reconnectAttempts.current - 1),
      60000
    );

    console.log(
      `Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current})`
    );

    setTimeout(connect, delay);
  };

  const cleanup = () => {
    if (pingInterval.current) clearInterval(pingInterval.current);
    if (pongTimeout.current) clearTimeout(pongTimeout.current);
  };

  const sendMessage = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send("Hello from Next.js");
    } else {
      console.log("WebSocket not connected");
    }
  };

  useEffect(() => {
    connect();

    return () => {
      cleanup();
      wsRef.current?.close();
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>WebSocket Client</h2>
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
}