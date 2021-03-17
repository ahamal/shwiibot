import { useState, useEffect } from 'react';
import { Map } from 'immutable';


class Controller {
  constructor() {
    this.emitter = new Emitter();
    this.state = new Map();
  }

  setState = (s) => {
    this.state = this.state.merge(Map(s));
    this.emitter.emit('change');
  }

  emit() {
    this.emitter.emit.apply(this.emitter, arguments);
  }

  on() {
    return this.emitter.on.apply(this.emitter, arguments);
  }

  usedState() {
    // eslint-disable-next-line
    const [state, setState] = useState(this.state);
    // eslint-disable-next-line
    useEffect(_ => this.on('change', _ => setState(this.state)), []);
    return state;
  }
}


class Emitter {
  constructor() {
    this.listeners = {};
  }

  on(event, fn) {
    if (!this.listeners[event])
      this.listeners[event] = new Set();
    const listeners = this.listeners[event];
    listeners.add(fn);
    return _ => listeners.delete(fn);
  }

  emit = (event, value) => {
    if (!this.listeners[event])
      return;
    // cloning set so that any new set entries would be ignored
    const listeners = new Set(this.listeners[event]);
    listeners.forEach(fn => fn(value));
  }

  destroy() {
    for (var event in this.listeners) {
      const listeners = this.listeners[event];
      listeners.forEach(fn => listeners.delete(fn));
    }
  }
}


export default Controller;