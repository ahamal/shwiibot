const
  HID = require('node-hid'),
  express = require('express'),
  SerialPort = require('serialport'),
  Readline = require('@serialport/parser-readline'),
  config = require('./config.js');


// SocketIO
const
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http, { cors: { origin: '*', methods: ['GET', 'POST'] } });

// Serial
const
  port = new SerialPort(config.serialPort, config.serialPortConfig),
  parser = port.pipe(new Readline({ delimiter: '\n' }));

// Wiimote
const
  wiimoteInfo = HID.devices().find(d => d.product === config.wiimoteProduct),
  wiimote = wiimoteInfo && new HID.HID(wiimoteInfo.path);

var
  portReady = false,
  wiimoteReady = false;


// SocketIO
io.on('connection', (socket) => {
  console.log('[websocket connect]');
  socket.on('disconnect', _ => { console.log('[websocket disconnect]'); });
  socket.on('write wiimote', (data) => {
    if (wiimoteReady)
      wiimote.write(data);
  });
  socket.on('write serial', (data) => { 
    if (portReady)
      port.write(data);
  });
});


// Wiimote + SocketIO
if (wiimote) {
  console.log('Wiimote fround connected.')
  wiimote.on('data', d => io.emit('wiimote', d));
  wiimoteReady = true;
} else {
  console.error('No wiimote found. Connect and restart.');
}


// Port + SocketIO
port.on('open', () => {
  console.log('Serial port connected');
  portReady = true;

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

port.on('error', e => {
  console.error('No serialport found. Connect and restart.')
})

parser.on('data', data => {
  io.emit('serial', data);
});


// Server Start
app.use(express.static('public'));
http.listen(4001, () => { console.log('listening on *:4001'); });




