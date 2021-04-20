import { PropsWithChildren } from "react";
import Select, { ActionMeta, components, SingleValueProps } from "react-select";
import styles from "./Dropzone.module.css";
import { useDropzone, FileWithPath, FileRejection, DropEvent, DropzoneProps } from "react-dropzone";
import { FileEarmark as DocIcon } from "react-bootstrap-icons";
import { FieldAttributes, FieldConfig, FieldProps } from "formik";

interface IUDropzone {
  onDrop: <T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent) => void;
  values: File[];
  onClickReset: (event: unknown) => void;
}

interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  endText: string;
}

const DropzoneComponent = ({
  field,
  form: { setFieldValue, setFieldTouched, ...restForm },
}: PropsWithChildren<any>) => {
  const onDrop = (acceptedFiles: File[]): void => {
    setFieldValue(field.name, acceptedFiles);
  };

  const handleOnFocus = () => {
    setFieldTouched(field.name, true);
  };

  const removeAll = () => {
    setFieldValue(field.name, []);
  };

  return <UncontrolledDropzone values={field.value as Array<File>} onDrop={onDrop} onClickReset={() => removeAll()} />;
};

const UncontrolledDropzone = ({ onDrop, values = [], onClickReset }: IUDropzone): JSX.Element => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ["image/jpeg", "image/png", "application/pdf"],
  });
  const files = values.map((file: FileWithPath) => (
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
          <DocIcon height={48} width={48} className="mb-3" style={{ color: "rgba(0,0,0,0.5)" }} />
          <p>{files?.length > 0 ? files[0] : "File surat harus berekstensikan jpg, png atau pdf"}</p>
        </div>
      </div>
      {files?.length > 0 && (
        <div className="w-100 d-flex mt-1" style={{ justifyContent: "center", alignItems: "center" }}>
          <small
            onClick={onClickReset}
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

const InputComponent = ({ endText = "hari", ...props }: PropsWithChildren<InputProps>): JSX.Element => {
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
}: PropsWithChildren<FieldAttributes<any>>): JSX.Element => {
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

const SelectStaff = ({ placeholder, form, field, value, options }: PropsWithChildren<FieldAttributes<any>>) => {
  // reconstruct option from value
  const optionStaff = options.map(({ displayName, ...rest }: { displayName: string }) => ({
    label: displayName,
    value: ({ displayName, ...rest } as unknown) as string,
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

export { InputComponent, SelectComponent, SelectStaff, DropzoneComponent, UncontrolledDropzone };
