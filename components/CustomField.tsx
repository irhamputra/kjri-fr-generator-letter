import { name } from "dayjs/locale/*";
import * as React from "react";
import Select, { components, SelectComponentsConfig } from "react-select";
import { Props } from "react-select/src/Select";

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

const SelectComponent: React.FC<Props> = ({
  placeholder,
  field,
  form: { setFieldValue, setFieldTouched },
  options,
  components,
  value,
  styles,
  matcher,
}) => {
  // reconstruct option from value
  const index = matcher
    ? matcher(options)
    : options?.findIndex((valueProp) => valueProp === value);

  const option = options?.[index];

  const handleOnChange = (option, { action }) => {
    if (action === "select-option") {
      setFieldValue(field.name, option?.value);
    }
  };

  const handleOnFocus = () => {
    setFieldTouched(field.name, true);
  };

  return (
    <div>
      <Select
        id={field.name}
        value={value ? option : value}
        instanceId={field.name}
        isClearable
        placeholder={placeholder}
        components={components}
        onChange={handleOnChange}
        options={options}
        onFocus={handleOnFocus}
        styles={styles}
      />
    </div>
  );
};

const mockStaff = [
  {
    nama: "Acep Somantri",
    nip: 1908283909123819,
    golongan: "IV/c",
    jabatan: "Kepala Perwakilan",
    bidang: "Konsul Jendral",
  },
];

const mockOptions = mockStaff.map(({ nama, ...rest }) => ({
  label: nama,
  value: ({ nama, ...rest } as unknown) as string,
}));

const SelectStaff = ({ placeholder, form, field, value }) => {
  // reconstruct option from value

  const SingleValue = (props) => {
    const { nip, golongan, bidang, jabatan } = value;

    return (
      <components.SingleValue {...props}>
        <div>
          <div>{props.children}</div>
          <div style={{ fontSize: 10, color: "rgba(0, 0, 0, 0.6)" }}>
            {`${nip} | Gol ${golongan} | ${jabatan} | ${bidang}`}
          </div>
        </div>
      </components.SingleValue>
    );
  };

  return (
    <SelectComponent
      components={{ SingleValue }}
      placeholder={placeholder}
      form={form}
      value={value}
      field={field}
      styles={{ control: (provided) => ({ ...provided, height: 66 }) }}
      options={mockOptions}
    />
  );
};

export { InputComponent, SelectComponent, SelectStaff };
