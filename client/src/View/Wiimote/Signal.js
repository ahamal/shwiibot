import './Signal.css';

function Signal({ wiimote }) {
  const write = (arr) => wiimote.writeDevice(arr);

  return (
    <div className="signal">
      <div className="group">
        <div className="label"><strong>LED</strong></div>
        <button onClick={_ => write([0x11, 0b00010000])}>
          1
        </button>
        <button onClick={_ => write([0x11, 0b00100000])}>
          2
        </button>
        <button onClick={_ => write([0x11, 0b01000000])}>
          3
        </button>
        <button onClick={_ => write([0x11, 0b10000000])}>
          4
        </button>
      </div>

      <div className="group">
        <div className="label"><strong>Rumble</strong></div>

        <button onClick={_ => write([0x10, 0x01])}>
          On
        </button>
        <button onClick={_ => write([0x10, 0x10])}>
          Off
        </button>
      </div>

      <div className="group">
        <div className="label"><strong>Input Mode</strong></div>

        <button onClick={_ => write([0x12, 0x00, 0x30])}>
          x30
        </button>
        <button onClick={_ => write([0x12, 0x00, 0x31])}>
          x31
        </button>
        <button onClick={_ => write([0x12, 0x00, 0x33])}>
          x33
        </button>
        <button onClick={_ => write([0x12, 0x00, 0x37])}>
          x37
        </button>
      </div>
        
      <div className="group">
        <div className="label"><strong>IR Camera</strong></div>
        <button onClick={_ => wiimote.activateIRCamera()}>
          Activate
        </button>
      </div>
    </div> 
  )
}

export default Signal;