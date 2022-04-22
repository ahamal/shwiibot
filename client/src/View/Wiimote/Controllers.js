import './Controllers.css';

function Controllers({ state }) {
  const
    buttons = state.get('buttons'),
    stick = state.get('stick'),
    getClass = b => ('controller-btn btn-' + b + (buttons.get(b) ? ' active' : ''));

  return (
    <div className="controllers">
      <div className="main">
        <div className="dir">
          <div className={getClass('up')}>←</div>
          <div className="vertical">
            <div className={getClass('right')}>↑</div>
            <div className={getClass('left')}>↓</div>
          </div>
          <div className={getClass('down')}>→</div>
        </div>

        <div className={getClass('a')}>A</div>
        <div className={getClass('home')}>⌂</div>
        <div className={getClass('plus')}>+</div>
        <div className={getClass('minus')}>-</div>
        <div className={getClass('1')}>1</div>
        <div className={getClass('2')}>2</div>
        <div className={getClass('trigger')}>t</div>
      </div>

      <div className="nunchuk">
        <div className="stick">
          { stick.get('sx') && stick.get('sy') && (
            <div className="dot" style={{
              left: stick.get('sx') * (80 / 256) - 20,
              top: 80 - stick.get('sy') * (80 / 256) - 20
              }} />
          ) }
        </div>

        <div className="nunchuk-buttons">
          <div className={getClass('c')}>C</div>
          <div className={getClass('z')}>Z</div>
        </div>
      </div>
    </div>
  );
}

export default Controllers;