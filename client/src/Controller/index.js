import BaseController from './BaseController';
import io from 'socket.io-client';
import { Map } from 'immutable';
import Wiimote from './Wiimote';
import Robot from './Robot';


class Controller extends BaseController {
  constructor() {
    super();
    const socket = this.socket = io('http://localhost:4001');

    this.wiimote = new Wiimote(this);
    this.state = new Map({ connected: false, device: null });
    this.robot = new Robot(this);

    socket.on('connect', this.onConnected);
    socket.on('disconnect', this.onDisconnect);
    socket.on('wiimote', this.onWiimoteData);
  }

  onConnected = () => {
    this.setState({ connected: true });
  }

  onDisconnect = () => {
    this.setState({ connected: false });
  }

  onWiimoteData = (d) => {
    const data = new Uint8Array(d);
    this.wiimote.processData(data);
  }
}

export default Controller;