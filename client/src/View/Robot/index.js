import ThreeD from '../common/ThreeD';
import { Bot } from '../common/ThreeD/models';
import { useRef, useEffect } from 'react';
import './style.css';


function Robot({ controller }) {
  const
    ref = useRef(),
    robot = controller.robot,
    state = controller.robot.usedState();
    

  useEffect(_ => {
    const
      stage = ref.current,
      model = new Bot();
      // ground = new Ground();

    stage.add(model);
    // stage.add(ground);

    function updateModel() {
      // const { l0, l1  } = controller.robot.state.toJS();
      // model.animate();
      // model.g.rArm2.rotation.x = Math.PI * l0 / 180;
      // model.g.lArm2.rotation.x = Math.PI * l1 / 180;
    }
    updateModel();

    return controller.robot.on('change', _ => {
      updateModel();
    });
  }, [controller.robot]);

  return (
    <div className="robot">
      <ThreeD ref={ref} />
      <hr />
      <Sliders state={state} setState={robot.setState} />
    </div>
  )
}


function Sliders({ state, setState }) {
  return (
    <div className="sliders">
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
    </div>
  )
}

function Slider({ id, state, setState }) {
  return (
    <div className="slider">
      <div><strong>{id}</strong> {state.get(id)}</div>
      <input
        type="range"
        min={20}
        max={160}
        value={state.get(id)}
        onChange={e => {
          setState({[id]: e.currentTarget.value })
        }} />
    </div>
  );
}


export default Robot;


  // angxR = 0;
  // angyR = 0;
  // angxL = 0;
  // angyL = 0;

  // updatePhysics() {
  //   const
  //     [angxR, angyR] = this.getAngle(this.props.accl1),
  //     [angxL, angyL] = this.getAngle(this.props.accl2);

  //   this.angxL = angxL * .2 + this.angxL * .8;
  //   this.angyL = angyL * .2 + this.angyL * .8;

  //   this.angxR = angxR * .2 + this.angxR * .8;
  //   this.angyR = angyR * .2 + this.angyR * .8;

  //   this.model.g.lArm.rotation.x = this.angyL * 2;
  //   this.model.g.lArm.rotation.z = this.angxL * 2;

  //   this.model.g.rArm.rotation.x = this.angyR * 2;
  //   this.model.g.rArm.rotation.z = this.angxR * 2;


  //   if (this.props.buttons.get('left'))
  //     this.model.g.rArm2.rotation.x += .1;
  //   if (this.props.buttons.get('right'))
  //     this.model.g.rArm2.rotation.x -= .1;

  //   if (this.props.buttons.get('up'))
  //     this.model.g.rArm2.rotation.z += .1;
  //   if (this.props.buttons.get('down'))
  //     this.model.g.rArm2.rotation.z -= .1;

      
  //   this.model.g.lArm2.rotation.x = 2 * (128 - this.props.nunchuk.get('sy')) / 128;
  //   this.model.g.lArm2.rotation.z = 2 * (128 - this.props.nunchuk.get('sx')) / 128;
  // }

  // getAngle(accl) {
  //   const
  //     ax = accl.get('ax') - 512,
  //     ay = accl.get('ay') - 512,
  //     az = accl.get('az') - 512,
  //     x2 = ax * ax,
  //     y2 = ay * ay,
  //     z2 = az * az,
  //     angx = Math.atan(ax / Math.sqrt(y2 + z2)),
  //     angy = Math.atan(ay / Math.sqrt(x2 + z2));
  //   return [angx, angy];
  // }
