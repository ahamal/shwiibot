import BaseController from './BaseController';
import { Map } from 'immutable';


const
  deg180 = Math.PI,
  deg90 = deg180 / 2,

  normalize = (a, r0, r1) => (a - r0) / (r1 - r0),
  damp = .25,
  ndamp = .75,
  
  buttonIncrement = 1/32;

class Robot extends BaseController {
  constructor(parent, wiimote) {
    super();
    this.parent = parent;
    this.state = new Map({
      l0: 0.5, l1: 0.5, l2: 0.5, l3: 0.5,
      r0: 0.5, r1: 0.5, r2: 0.5, r3: 0.5,

      copyWiimote: false,
      writeToArduino: true
    });

    setInterval(this.copyWiimoteAngels, 20);
    setInterval(this.writeArduino, 50);
  }


  copyWiimoteAngels = () => {
    if (!this.state.get('copyWiimote'))
      return;

    const
      s = this.parent.wiimote.state,
      accl1 = s.get('accl1'),
      accl2 = s.get('accl2'),
      stick = s.get('stick'),
      buttons = s.get('buttons'),
      
      ax1 = accl1.get('ax'),
      ay1 = accl1.get('ay'),
      ax2 = accl2.get('ax'),
      ay2 = accl2.get('ay');
      
    const
      l0 = damp * normalize(ay1, -deg90, deg90) + ndamp * this.state.get('l0'),
      l1 = damp * normalize(ax1, -deg90, deg90) + ndamp * this.state.get('l1'),
      r0 = damp * normalize(ay2, -deg90, deg90) + ndamp * this.state.get('r0'),
      r2 = damp * normalize(ax2, -deg90, deg90) + ndamp * this.state.get('r2'),
      r1 = stick.get('sx') / 256,
      r3 = 1 - (stick.get('sy') / 256);

    var
      l2 = this.state.get('l2'),
      l3 = this.state.get('l3');

    if (buttons.get('right')) l2 = Math.min(l2 + buttonIncrement, 1);
    if (buttons.get('left')) l2 = Math.max(l2 - buttonIncrement, 0);
    if (buttons.get('down')) l3 = Math.min(l3 + buttonIncrement, 1);
    if (buttons.get('up')) l3 = Math.max(l3 - buttonIncrement, 0);
    
    this.setState({ l0, l1, l2, l3, r0, r1, r2, r3 });    
  }

  arduinoMap = [
    // Arm, Pin, Min, Max
    ['r0', 2, 0, 160],
    ['r1', 3, 160, 0],
    ['r2', 4, 0, 160],
    ['r3', 5, 0, 160],
    
    ['l0', 6, 0, 160],
    ['l1', 7, 160, 0],
    ['l2', 8, 0, 160],
    ['l3', 9, 0, 160]
  ]

  lastSent = [null, null, null, null, null, null, null, null];
  
  writeArduino = () => {
    if (!this.state.get('writeToArduino') || !this.parent.state.get('connected'))
      return;

    this.arduinoMap.forEach((x, i) => {
      const
        [arm, pin, min, max] = x,
        angle = Math.floor(this.state.get(arm) * (max - min) + min);

      if (this.lastSent[i] === angle)
        return;

      const data = ['D'.charCodeAt(0), `${pin}`.charCodeAt(0), angle, '\n'.charCodeAt(0)];
      this.parent.socket.emit('write serial', data);
      this.lastSent[i] = angle;
    });
  }
}

export default Robot;