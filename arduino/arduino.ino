#include <Servo.h>

Servo servos[8];

const byte MAX_SIZE = 32;
const char DELIMITER = '\n';
char data[MAX_SIZE];
int index = 0;

void setup() {
  Serial.begin(9600);
  
  for(int i = 0; i < 8; i++) {
    servos[i].attach(i + 2);
  }
}

void loop() {
  pumpData();
}


char receivedChar;
void pumpData() {
  while(Serial.available() > 0) {
    receivedChar = Serial.read();
    if (receivedChar == DELIMITER) {
      data[index] = '\0';
      processData();
      clearData();
    } else {
      data[index] = receivedChar;
      index++;
      
      if (index >= MAX_SIZE) {
        Serial.println("err overflow");
        clearData();
      }
    }
   }
}

void clearData() {
  index = 0;
  memset(data, MAX_SIZE, sizeof(data));
}

void processData() {
  if (data[0] == 'D') {
    int n = data[1] - '0';
    int angle = data[2];
    
    if (n >= 2 && n <= 10 && angle > 0 && angle < 180) {
      servos[n - 2].write(angle);
      Serial.println("ok");
      return;
    }
  }
  Serial.print("err unknown");
}
