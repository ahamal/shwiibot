import './Accelerometer.css';

function Accelerometer({ accl }) {
  const 
    ax = accl.get('ax'),
    ay = accl.get('ay'),
    az = accl.get('az');

  return (
    <div className="accelerometer">
        <div className="g-container">
          <div className="label">XY</div>
          <div className="stage-2d xy-stage">
            { ax && ay && (
              <div className="dot" style={{ top: (ax/8 - 5) + 'px', left: (ay/8 - 5) + 'px' }} />
            ) }
          </div>
        </div>

        <div className="g-container">
          <div className="label">XZ</div>
          <div className="stage-2d xy-stage">
          { ax && az && (
            <div className="dot" style={{ top: (ax/8 - 5) + 'px', left: (az/8 - 5) + 'px' }} />
          ) }
          </div>
        </div>        

        <div className="g-container">
          <div className="label"> X {ax}</div>
          <div className="stage-1d x-stage">
            { ax && <div className="dot" style={{ left: ax/4 + 'px' }} /> }
          </div>

          <div className="label"> Y {ay}</div>
          <div className="stage-1d x-stage">
            { ax && <div className="dot" style={{ left: ay/4 + 'px' }} /> }
          </div>

          <div className="label"> Z {az}</div>
          <div className="stage-1d x-stage">
            { az && <div className="dot" style={{ left: az/4 + 'px' }} /> }
          </div>
        </div>
    </div>
  )
}

export default Accelerometer;