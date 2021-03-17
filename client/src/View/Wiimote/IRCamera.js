import './IRCamera.css'

function IRCamera({ irCoordinates  }) {
  const c = irCoordinates.toJS();
  
  return (
    <div className="ircamera">
      <div className="stage">
        <div className="info">
          x1 {c.x1}<br />
          y1 {c.y1}<br />
          x2 {c.x2}<br />
          y2 {c.y2}<br />
          x3 {c.x3}<br />
          y3 {c.y3}<br />
          x4 {c.x4}<br />
          y4 {c.y4}
        </div>
        <Dot x={c.x1} y={c.y1} />
        <Dot x={c.x2} y={c.y2} />
        <Dot x={c.x3} y={c.y3} />
        <Dot x={c.x4} y={c.y4} />
      </div>
    </div>
  )
}

function Dot({x, y}) {
  if (!x || !y || x === 1023 || y === 1023)
    return '';

  return (
    <div className="dot" style={{ left: x / 2, top: 384 - (y / 2) }} />
  )
}

export default IRCamera;