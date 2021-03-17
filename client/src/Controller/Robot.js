import BaseController from './BaseController';
import { Map } from 'immutable';

class Robot extends BaseController {
  constructor(parent) {
    super();
    this.parent = parent;
    this.state = new Map({
      l0: 90, l1: 90, l2: 90, l3: 90,
      r0: 90, r1: 90, r2: 90, r3: 90
    });
  }
}

export default Robot;