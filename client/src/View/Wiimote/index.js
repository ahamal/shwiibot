import Controllers from './Controllers';
import Raw from './Raw';
import Accelerometer from './Accelerometer';
import Signal from './Signal';
import IRCamera from './IRCamera';

import './style.css';

function App({ controller }) {
  const state = controller.wiimote.usedState();

  return (
    <div className="wiimote">
      <div className="page page1">
        <div className="page-content">
          <h5>Data</h5>
          <Raw state={state} />
          <hr />

          <h5>Controllers</h5>
          <Controllers state={state} />
          <hr />

          <h5>Signal</h5>
          <Signal wiimote={controller.wiimote} />
        </div>
      </div>

      <div className="page">
        <div className="page-content">
          <h5>Accelerometers</h5>
          <Accelerometer accl={state.get('accl1')} />
          <Accelerometer accl={state.get('accl2')} />
          
          <hr />
          <h5>IR Camera</h5>
          <IRCamera irCoordinates={state.get('ir')} />
        </div>
      </div>
    </div>
  );
}

export default App;