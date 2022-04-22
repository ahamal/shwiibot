import { useRef, useEffect } from 'react';
import { Bot } from '../common/ThreeD/models';
import ThreeD from '../common/ThreeD';

import './style.css';


function Robot({ controller }) {
  const
    ref = useRef(),
    robot = controller.robot,
    state = robot.usedState(),
    setState = robot.setState;
  
  useEffect(_ => {
    const
      stage = ref.current,
      model = new Bot();
    
    stage.add(model);
    function updateModel() {
      const { l0, l1, l2, l3, r0, r1, r2, r3  } = robot.state.toJS();
      model.setAngle('l0', l0);
      model.setAngle('l1', l1);
      model.setAngle('l2', l2);
      model.setAngle('l3', l3);
      
      model.setAngle('r0', r0);
      model.setAngle('r1', r1);
      model.setAngle('r2', r2);
      model.setAngle('r3', r3);
    }
    updateModel();
    return robot.on('change', _ => updateModel());
  }, [robot]);
  

  return (
    <div className="robot">
      <ThreeD ref={ref} />
      <hr />
      <div className="row">
        <div className="left-arm-sliders slider-group">
          <h5>Left Arm</h5>
          <Slider id="l0" {...{state, setState}} />
          <Slider id="l1" {...{state, setState}} />
          <Slider id="l2" {...{state, setState}} />
          <Slider id="l3" {...{state, setState}} />
        </div>

        <div className="right-arm-sliders slider-group">
          <h5>Right Arm</h5>
          <Slider id="r0" {...{state, setState}} />
          <Slider id="r1" {...{state, setState}} />
          <Slider id="r2" {...{state, setState}} />
          <Slider id="r3" {...{state, setState}} />
        </div>

        <div className="robot-settings">
          <label>
            <input
              type="checkbox"
              value={state.get('copyWiimote')}
              onChange={e => console.log(e.currentTarget.value) ||  robot.setState({ copyWiimote: e.currentTarget.value })}/>
              
            Copy Wiimote
          </label>
        </div>
      </div>
    </div>
  )
}

function Slider({ id, state, setState }) {
  return (
    <div className="slider">
      <div><strong>{id}</strong> {state.get(id)}</div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={state.get(id)}
        onChange={e => {
          setState({[id]: e.currentTarget.value })
        }} />
    </div>
  );
}


export default Robot;