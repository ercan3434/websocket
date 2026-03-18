#include <ESP8266WiFi.h>
#include <WebSocketsClient.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

const char* ws_server = "websocket-08mt.onrender.com"; // Server domain
const int ws_port = 443; // wss için 443, ws için 80

WebSocketsClient webSocket;

const int ledPin = D1; // LED bağlı pin

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.println("WebSocket kapandı");
      break;
    case WStype_CONNECTED:
      Serial.println("WebSocket bağlandı");
      break;
    case WStype_TEXT:
      Serial.print("Komut geldi: ");
      Serial.println((char*)payload);
      
      if (strcmp((char*)payload, "TURN_ON") == 0) {
        digitalWrite(ledPin, HIGH);
      } else if (strcmp((char*)payload, "TURN_OFF") == 0) {
        digitalWrite(ledPin, LOW);
      }
      break;
    default:
      break;
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  
  WiFi.begin(ssid, password);
  Serial.print("WiFi bağlanıyor...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Bağlandı!");
  
  // WebSocket ayarları
  webSocket.begin(ws_server, ws_port, "/"); // path server tarafında root "/"
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000); // 5 saniye reconnect
}

void loop() {
  webSocket.loop();
}