#include <ESP8266WiFi.h>
#include <WebSocketsClient.h>

const char* ssid = "WIFI_ADI";
const char* password = "WIFI_SIFRE";

WebSocketsClient webSocket;
#define LED_PIN 2

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_CONNECTED: Serial.println("WS bağlandı"); break;
    case WStype_TEXT:
      Serial.printf("Mesaj: %s\n", payload);
      if(strcmp((char*)payload,"TURN_ON")==0) digitalWrite(LED_PIN,HIGH);
      if(strcmp((char*)payload,"TURN_OFF")==0) digitalWrite(LED_PIN,LOW);
      break;
    case WStype_DISCONNECTED: Serial.println("WS kapandı"); break;
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  WiFi.begin(ssid,password);
  while(WiFi.status()!=WL_CONNECTED){delay(500); Serial.print(".");}
  Serial.println("WiFi bağlandı");

  webSocket.begin("192.168.1.100",3001,"/"); // Node.js server IP
  webSocket.onEvent(webSocketEvent);
}

void loop() {
  webSocket.loop();
}