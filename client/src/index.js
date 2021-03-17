import React from 'react';
import ReactDOM from 'react-dom';
import View from './View';
import Controller from './Controller';

import './normalize.css';
import './skeleton.css';
import './index.css';


const controller = new Controller();

ReactDOM.render(
  <React.StrictMode>
    <View controller={controller} />
  </React.StrictMode>,
  document.getElementById('root')
);