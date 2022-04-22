import './Accelerometer.css';

function Accelerometer({ accl }) {
  const 
    dx = accl.get('dx'),
    dy = accl.get('dy'),
    dz = accl.get('dz'),
    ax = accl.get('ax'),
    ay = accl.get('ay');

  return (
    <div className="accelerometer">
        <div className="g-container">
          <div className="label">XY</div>
          <div className="stage-2d xy-stage">
            { dx && dy && (
              <div className="dot" style={{ top: (dx/8 - 5) + 'px', left: (dy/8 - 5) + 'px' }} />
            ) }
          </div>
        </div>

        <div className="g-container">
          <div className="label">XZ</div>
          <div className="stage-2d xy-stage">
          { dx && dz && (
            <div className="dot" style={{ top: (dx/8 - 5) + 'px', left: (dz/8 - 5) + 'px' }} />
          ) }
          </div>
        </div>        

        <div className="g-container">
          <div className="label"> X {dx}</div>
          <div className="stage-1d x-stage">
            { dx && <div className="dot" style={{ left: dx/4 + 'px' }} /> }
          </div>

          <div className="label"> Y {dy}</div>
          <div className="stage-1d x-stage">
            { dx && <div className="dot" style={{ left: dy/4 + 'px' }} /> }
          </div>

          <div className="label"> Z {dz}</div>
          <div className="stage-1d x-stage">
            { dz && <div className="dot" style={{ left: dz/4 + 'px' }} /> }
          </div>

          { ax !== null && ay !== null && (
            <div>
              <div className="angle">
                <strong>ax {Math.floor(ax * 180 / Math.PI)}</strong>
                <div className="circle" style={{ transform: `rotate(${ax}rad)` }}>
                  <div className="line"></div>
                </div>
              </div>

              <div className="angle">
                <strong>ay {Math.floor(ay * 180 / Math.PI)}</strong>
                <div className="circle" style={{ transform: `rotate(${ay}rad)` }}>
                  <div className="line"></div>
                </div>
              </div>
            </div>
          )}
        </div>
    </div>
  )
}

export default Accelerometer;