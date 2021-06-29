import * as React from "react";
import Select, { ActionMeta, components, SingleValueProps } from "react-select";
import { FieldAttributes } from "formik";
import DatePicker from "react-datepicker";
import { Calendar } from "react-bootstrap-icons";

interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  endText: string;
}

const InputComponent = ({ endText = "hari", ...props }: React.PropsWithChildren<InputProps>): JSX.Element => {
  return (
    <div className="input-group">
      <input className="form-control" type="text" {...props} />
      {endText && (
        <span className="input-group-text" id="durasi-hari">
          {endText}
        </span>
      )}
    </div>
  );
};

const SelectComponent = ({
  placeholder,
  field,
  form,
  options,
  components,
  value,
  styles,
  matcher,
}: React.PropsWithChildren<FieldAttributes<any>>): JSX.Element => {
  // reconstruct option from value
  const index = matcher
    ? matcher(options)
    : options?.findIndex((valueProp: { value: string }) => valueProp.value === value);

  const _value = index !== -1 ? options?.[index] : null;

  const handleOnChange = (option: any, { action }: ActionMeta<any>) => {
    if (action === "select-option") {
      form.setFieldValue(field.name, option?.value);
    }

    if (action === "clear") {
      form.setFieldValue(field.name, "");
    }
  };

  const handleOnFocus = () => {
    form.setFieldTouched(field.name, true);
  };

  return (
    <Select
      id={field.name}
      value={_value}
      instanceId={field.name}
      isClearable
      placeholder={placeholder}
      components={components}
      onChange={handleOnChange}
      options={options}
      onFocus={handleOnFocus}
      styles={styles}
    />
  );
};

const SelectStaff = ({ placeholder, form, field, value, options }: React.PropsWithChildren<FieldAttributes<any>>) => {
  // reconstruct option from value
  const optionStaff = options.map(({ displayName, ...rest }: { displayName: string }) => ({
    label: displayName,
    value: { displayName, ...rest } as unknown as string,
  }));

  const SingleValue = (props: SingleValueProps<any>) => {
    const { nip, golongan, jabatan } = value;

    return (
      <components.SingleValue {...props}>
        <div>
          <div>{props.children}</div>
          <div style={{ fontSize: 10, color: "rgba(0, 0, 0, 0.6)" }}>{`${nip} | Gol ${golongan} | ${jabatan}`}</div>
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
      matcher={(opt: Record<string, { uid: string }>[]) =>
        opt.findIndex((v) => {
          return v?.value?.uid === value.uid;
        })
      }
      styles={{ control: (provided: Record<string, string>) => ({ ...provided, height: 66 }) }}
      options={optionStaff}
    />
  );
};

const DatePickerComponent = ({ form, field, value }: FieldAttributes<any>) => {
  const { setFieldValue } = form;
  const { name } = field;
  return (
    <div className="reactDateWrapper">
      <DatePicker selected={value} onChange={(val) => setFieldValue(name, val)} dateFormat="dd.MM.yyyy" />
      <Calendar className="icon" />
    </div>
  );
};

export { InputComponent, SelectComponent, SelectStaff, DatePickerComponent };
