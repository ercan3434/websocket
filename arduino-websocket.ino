#include <ESP8266WiFi.h>
#include <WebSocketsClient.h>

const char* ssid = "WIFI_ADI";
const char* password = "WIFI_SIFRE";

WebSocketsClient webSocket;

#define LED_PIN D1

String ledState = "OFF";

// 👇 Server’dan mesaj gelince
void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  if (type == WStype_TEXT) {
    String msg = (char*)payload;
    Serial.println("Gelen: " + msg);

    // JSON parse basit (string contains)
    if (msg.indexOf("TURN_ON") >= 0) {
      digitalWrite(LED_PIN, HIGH);
      ledState = "ON";
    }

    if (msg.indexOf("TURN_OFF") >= 0) {
      digitalWrite(LED_PIN, LOW);
      ledState = "OFF";
    }

    // 👇 State'i geri gönder (ÇOK KRİTİK)
    String response = "{\"type\":\"STATE\",\"value\":\"" + ledState + "\"}";
    webSocket.sendTXT(response);
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);

  WiFi.begin(ssid, password);

  Serial.print("WiFi bağlanıyor");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi bağlandı");

  // 👇 Server IP
  webSocket.begin("websocket-08mt.onrender.com", 443, "/");
  webSocket.setSSL(true); // wss
  webSocket.onEvent(webSocketEvent);

  // reconnect
  webSocket.setReconnectInterval(5000);
}

void loop() {
  webSocket.loop();
}