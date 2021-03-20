import * as React from "react";

const InputComponent: React.FC = (props) => {
  return (
    <div className="input-group">
      <input className="form-control" type="text" {...props} />
      <span className="input-group-text" id="durasi-hari">
        hari
      </span>
    </div>
  );
};

export default InputComponent;
