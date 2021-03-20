import * as React from "react";
import Select from "react-select";

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

const SelectComponent = ({
  placeholder,
  field,
  form: { setFieldValue, setFieldTouched, ...restForm },
  options,
}) => {
  const handleOnChange = (option, { action }) => {
    if (action === "select-option") {
      setFieldValue(field.name, option?.value);
    }
  };

  const handleOnFocus = () => {
    setFieldTouched(field.name, true);
    console.log(restForm);
  };

  return (
    <div>
      <Select
        id={field.name}
        instanceId={field.name}
        isClearable
        placeholder={placeholder}
        onChange={handleOnChange}
        options={options}
        onFocus={handleOnFocus}
      />
    </div>
  );
};

export { InputComponent, SelectComponent };
