import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Wiimote from './Wiimote';
import Robot from './Robot';

import './style.css';


function Index({ controller }) {
  return (
    <div className="app">
      <Router>
        <div className="app-nav">
          <Link to="/wiimote">Wiimote</Link>
          <Link to="/robot">Robot</Link>
        </div>

        <div className="app-body">
          <Switch>
            <Route path="/wiimote">
              <Wiimote controller={controller} />
            </Route>

            <Route path="/robot">
              <Robot controller={controller} />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  )
}

export default Index;