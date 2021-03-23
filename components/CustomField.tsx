import * as React from "react";
import Select, { components, SelectComponentsConfig } from "react-select";
import { Props } from "react-select/src/Select";
import styles from "./Dropzone.module.css";
import { useDropzone, FileWithPath } from "react-dropzone";
import { FileEarmark as DocIcon } from "react-bootstrap-icons";

const DropzoneComponent: React.FC<any> = ({
  field,
  form: { setFieldValue, setFieldTouched, ...restForm },
}) => {
  const onDrop = (acceptedFiles) => {
    console.log(acceptedFiles);
    setFieldValue(field.name, acceptedFiles);
  };

  const handleOnFocus = () => {
    setFieldTouched(field.name, true);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ["image/jpeg", "image/png", "application/pdf"],
  });

  const removeAll = () => {
    setFieldValue(field.name, []);
  };

  const files = field.value?.map((file: FileWithPath) => (
    <div key={file.path}>
      {file.path} - {file.size} bytes
    </div>
  ));

  return (
    <section style={{ background: "#f8f8f8" }} className="p-3 mb-3">
      <div {...getRootProps({ className: styles.dropzone })}>
        <input {...getInputProps()} />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <DocIcon
            height={48}
            width={48}
            className="mb-3"
            style={{ color: "rgba(0,0,0,0.5)" }}
          />
          <p>
            {files?.length > 0
              ? files[0]
              : "File surat harus berekstensikan jpg, png atau pdf"}
          </p>
        </div>
      </div>
      {files?.length > 0 && (
        <div
          className="w-100 d-flex mt-1"
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <small
            onClick={() => removeAll()}
            style={{
              cursor: "pointer",
            }}
            className="m-0"
          >
            Pilih Ulang
          </small>
        </div>
      )}
    </section>
  );
};

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

export { InputComponent, SelectComponent, SelectStaff, DropzoneComponent };
