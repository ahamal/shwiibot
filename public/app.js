const
  socket = io(),
  status = {};

var dataCount = 0;
socket.on('data', (d) => {
  const data = new Uint8Array(d);
  processData(data);
  dataCount += 1;
});

const dpsEl = document.getElementById('dps');
setInterval(_ => {
  dpsEl.innerHTML = dataCount;
  dataCount = 0;
}, 1000);


socket.on('connected', (msg) => {
  console.log('connected');
});

socket.on('status', (s) => {
  status.device = s.device;
  renderStatus(status);
});


// 


function processData(data) {
  const
    mode = data[0],
    bb0 = data[1],
    bb1 = data[2],
    axx = data[3],
    ayy = data[4],
    azz = data[5];

  updateButtons(bb0, bb1);
  updateAccelerometer(axx, ayy, azz);

  renderData(data);
}

function updateButtons(bb0, bb1) {
  updateButton('down', bb0 & 1);
  updateButton('up', bb0 & 2);
  updateButton('right', bb0 & 4);
  updateButton('left', bb0 & 8);
  updateButton('2', bb1 & 1);
  updateButton('1', bb1 & 2);
  updateButton('trigger', bb1 & 4);
  updateButton('a', bb1 & 8);
  updateButton('plus', bb0 & 16);
  updateButton('minus', bb1 & 16);
  updateButton('home', bb1 & 128);
}

const buttonState = {};
function updateButton(btn, pressed) {
  if (buttonState[btn] !== pressed) {
    if (pressed) {
      document.getElementById('btn-' + btn).className = 'game-btn active';
    }
    else {
      document.getElementById('btn-' + btn).className = 'game-btn';
    }    
    buttonState[btn] = pressed;
  }
}



function updateAccelerometer(xx, yy, zz) {
  document.getElementById('xy-dot').setAttribute('style', `top: ${xx}px; left: ${yy}px`);
  document.getElementById('xz-dot').setAttribute('style', `top: ${xx}px; left: ${zz}px`);
}



const
  hexEl = document.getElementById('hex'),
  binEl = document.getElementById('bin');

function renderData(data) {
  var hex = '', bin = '';

  data.forEach((d) => {
    hex += d.toString(16).padStart(2, '0') + ' ';
    bin += d.toString(2).padStart(8, '0') + ' ';
  });

  hexEl.innerHTML = hex;
  binEl.innerHTML = bin;  
}





function writeDevice(data) {
  socket.emit('write device', data);
}




const statusEl = document.getElementById('status');
function renderStatus(status) {
  statusEl.innerHTML = `<div>device connected: ${status.device}</div>`;
}
