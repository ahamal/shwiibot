const
  HID = require('node-hid'),
  express = require('express');

const
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http);

const
  deviceInfo = HID.devices().find(d => d.product === 'Nintendo RVL-CNT-01-TR'),
  device = deviceInfo && new HID.HID(deviceInfo.path);

io.on('connection', (socket) => {
  console.log('socket connection');
  socket.emit('status', { device: device ? true : false });
  socket.on('disconnect', _ => { console.log('socket disconnect'); });
  
  socket.on('write device', (data) => {
    console.log('write device', data);
    device.write(data);
  });
});

if (device)
  device.on('data', d => {
    io.emit('data', d);
  });

app.use(express.static('public'));
http.listen(3000, () => { console.log('listening on *:3000'); });