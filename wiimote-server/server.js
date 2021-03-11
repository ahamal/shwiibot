const
  HID = require('node-hid'),
  express = require('express'),
  SerialPort = require('serialport'),
  Readline = require('@serialport/parser-readline'),
  config = require('./config.js');


// Socket
const
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

// Serial
const
  port = new SerialPort(config.serialPort, config.serialPortConfig),
  parser = port.pipe(new Readline({ delimiter: '\n' }));

// Bluetooth
const
  deviceInfo = HID.devices().find(d => d.product === 'Nintendo RVL-CNT-01-TR'),
  device = deviceInfo && new HID.HID(deviceInfo.path);


io.on('connection', (socket) => {
  console.log('socket connection');
  socket.emit('status', { device: device });
  socket.on('disconnect', _ => { console.log('socket disconnect'); });
  
  socket.on('write device', (data) => {
    device.write(data);
  });
});

if (device) {
  console.log(deviceInfo);
  device.on('data', d => io.emit('data', d));
} else {
  console.log('no device found. connect wiimote and restart.')
}


// Read the port data
port.on('open', () => {
  console.log('serial port open');




  setInterval(_ => {
    const
      angle = Math.floor(Math.random() * 100) + 20,
      data = 'D2' + String.fromCharCode(angle) + '\n';
    console.log('Writing: ', angle)
    port.write(data);
  }, 600)

  setInterval(_ => {
    const
      angle = Math.floor(Math.random() * 100) + 20,
      data = 'D3' + String.fromCharCode(angle) + '\n';
    console.log('Writing: ', angle)
    port.write(data);
  }, 300)
  
});

parser.on('data', data =>{
  console.log('got word from arduino:', data);
});



app.use(express.static('public'));
http.listen(4001, () => { console.log('listening on *:4001'); });