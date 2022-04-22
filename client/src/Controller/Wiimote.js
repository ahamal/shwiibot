import BaseController from './BaseController';
import { Map } from 'immutable';
import { getAccelerometerAngles } from './calc';


class Wiimote extends BaseController {
  constructor(parent) {
    super();
    
    this.parent = parent;
    this.state = new Map({
      raw: null,

      buttons: new Map({
        'down': false, 'up': false, 'right': false, 'left': false,
        '1': false, '2': false, 'a': false, 'plus': false, 'minus': false,
        'trigger': false, 'home': false,
        'c': false, 'z': false
      }),
      stick: new Map({ 'sx': null, 'sy': null }),
      accl1: new Map({ dx: null, dy: null, dz: null, ax: null, ay: null }),
      accl2: new Map({ dx: null, dy: null, dz: null, ax: null, ay: null }),
      ir: new Map({})
    });

    this.dataCount = 0;
    setInterval(this.dpsTicker, 1000);
  }

  dpsTicker = () => {
    this.setState({ dps: this.dataCount });
    this.dataCount = 0;
  }

  processData(data) {
    this.dataCount += 1;
    const mode = data[0];
    
    var state = this.state.set('raw', data);

    if (mode >= 0x30 && mode <= 0x37) {
      state = updateButtons(state, data);
      state = updateAccelerometer(state, data);
      state = updateIR(state, data);
      state = updateNunchuk(state, data);

    } else {
      console.log('-- wiimote receive');
      console.log('Mode ' + mode.toString(16));
      console.log('Data: ', data.map(d => d.toString(16).padStart(2, '0')).join(' '));
      console.log('--');
    }

    this.state = state;
    this.emit('change');
  }

  writeDevice = (data) => {
    console.log('-- wiimote write')
    console.log(data.map(d => d.toString(16).padStart(2, '0')).join(' '))
    data = new Uint8Array(data);
    this.parent.socket.emit('write wiimote', data);
    console.log('--');
  }

  async activateIRCamera() {
    console.log('activating..');

    const pause = _ => new Promise(resolve => setTimeout(resolve, 50));

    // Enable IR Camera (Send 0x04 to Output Report 0x13)
    this.writeDevice([0x13, 0x04]);
    await pause();

    // Enable IR Camera 2 (Send 0x04 to Output Report 0x1a)
    this.writeDevice([0x1a, 0x04]);
    await pause();

    // Write 0x08 to register 0xb00030
    this.writeRegister([0xb0, 0x00, 0x30], [0x08]);
    await pause();

    // Write Sensitivity Block 1 to registers at 0xb00000
    this.writeRegister([0xb0, 0x00, 0x00], 
      [0x02, 0x00, 0x00, 0x71, 0x01, 0x00, 0xaa, 0x00, 0x64]);
    await pause();

    // Write Sensitivity Block 2 to registers at 0xb0001a
    this.writeRegister([0xb0, 0x00, 0x1a],
      [0x63, 0x03]);
    await pause();

    // Write Mode Number to register 0xb00033
    this.writeRegister([0xb0, 0x00, 0x33], [0x01]);
    await pause();
    
    // Write 0x08 to register 0xb00030 (again)
    this.writeRegister([0xb0, 0x00, 0x30], [0x08]);
    
    // Sensitivity Blocks
    // Block 1	                     Block 2	Notes
    // 00 00 00 00 00 00 90 00 C0    40 00    Suggested by Marcan
    // 00 00 00 00 00 00 FF 00 0C    00 00    Suggested by Kestrel (max sensitivity)
    // 00 00 00 00 00 00 90 00 41    40 00    Suggested by inio (high sensitivity)
    // 02 00 00 71 01 00 64 00 fe    fd 05    Wii level 1
    // 02 00 00 71 01 00 96 00 b4    b3 04    Wii level 2
    // 02 00 00 71 01 00 aa 00 64    63 03    Wii level 3 (Suggested by Cliff)
    // 02 00 00 71 01 00 c8 00 36    35 03    Wii level 4
    // 07 00 00 71 01 00 72 00 20    1f 03    Wii level 5

    // Mode Number
    // Basic	1
    // Extended	3
    // Full	5
  }

  writeRegister(address, data) {
    var payload = [0x16, 0x04].concat(address).concat([data.length]).concat(data);
    // Add padding to make 22
    payload = payload.concat(new Array(22 - payload.length).fill(0));
    this.writeDevice(payload);
  }
}



function updateButtons(state, data) {
  const
    b0 = data[1],
    b1 = data[2];
  
  var s = state.get('buttons');

  function fn(button, isPressed) {
    if (s.get(button) !== isPressed)
      s = s.set(button, isPressed);
  };

  fn('left', b0 & 1);
  fn('right', b0 & 2);
  fn('down', b0 & 4);
  fn('up', b0 & 8);
  fn('2', b1 & 1);
  fn('1', b1 & 2);
  fn('trigger', b1 & 4);
  fn('a', b1 & 8);
  fn('plus', b0 & 16);
  fn('minus', b1 & 16);
  fn('home', b1 & 128);

  return state.set('buttons', s);
}


function updateAccelerometer(state, data) {
  if (data[0] !== 0x31 && data[0] !== 0x33 && data[0] !== 0x37)
    return state;
  
  const
    dx = (data[3] << 2) | ((data[1] >> 5) & 0b11),
    dy = (data[4] << 2) | (((data[2] >> 5) & 0b1) << 1),
    dz = (data[5] << 2) | (((data[2] >> 6) & 0b1) << 1),
    [ax, ay] = getAccelerometerAngles(dx - 512, dy - 512, dz - 512);
  
  return state.set('accl1', state.get('accl1').merge({ dx, dy, dz, ax, ay }));
}


function updateIR(state, data) {
  if (data[0] !== 0x33 && data[0] !== 0x37)
    return state;
    
  const
    y1 = (((data[8] >> 6) & 0b11) << 8) | data[7],
    x1 = (((data[8] >> 4) & 0b11) << 8) | data[6],
    y2 = (((data[8] >> 2) & 0b11) << 8) | data[10],
    x2 = (((data[8] >> 0) & 0b11) << 8) | data[9],
    
    y3 = (((data[13] >> 6) & 0b11) << 8) | data[12],
    x3 = (((data[13] >> 4) & 0b11) << 8) | data[11],
    y4 = (((data[13] >> 2) & 0b11) << 8) | data[15],
    x4 = (((data[13] >> 0) & 0b11) << 8) | data[14];
  
  return state.set('ir', state.get('ir').merge({ 
    x1, y1, x2, y2, x3, y3, x4, y4
  }));
}

function updateNunchuk(state, data) {
  if (data[0] !== 0x37)
    return state;

  const
    l = data[21],
    dx = (data[18] << 2) | ((l >> 2) & 0b11),
    dy = (data[19] << 2) | ((l >> 4) & 0b11),
    dz = (data[20] << 2) | ((l >> 6) & 0b11),
    [ax, ay] = getAccelerometerAngles(dx - 512, dy - 512, dz - 512);

  return (
    state
      .set('buttons', state.get('buttons').merge({
        c: !((l >> 1) & 1),
        z: !((l & 1))
      }))
      .set('stick', state.get('stick').merge({
        sx: data[16],
        sy: data[17]
      }))
      .set('accl2', state.get('accl2').merge({
        dx, dy, dz, ax, ay        
      }))
  );
}

export default Wiimote;