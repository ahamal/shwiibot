import './Raw.css';

function Raw({ state }) {
  var data = state.get('raw');
  var hex = '', bin = '';
  if (data)
    data.forEach((d) => {
      hex += d.toString(16).padStart(2, '0') + ' ';
      bin += d.toString(2).padStart(8, '0') + ' ';
    });
  
  return (
    <div className="raw-data">
      <div>
        <div className="label">Data rate</div>
        <div className="value">{ state.get('dps') || '-' }</div>
      </div>
      <div>
        <div className="label">Hex</div>
        <div className="value">{ hex || '-' }</div>
      </div>
      <div>
        <div className="label">Binary</div>
        <div className="value">{ bin || '-' }</div>
      </div>
    </div>
  )
}

export default Raw;