import * as React from "react";
import { useDropzone } from "react-dropzone";
import { FormikErrors } from "formik";
import type { useSuratKeluarFormValues } from "../hooks/form/useSuratKeluarForm";
import { FilePdf } from "react-bootstrap-icons";

const baseStyle: React.CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "50px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
  cursor: "pointer",
};

const Dropzone: React.FC<{
  path: string;
  onSetFieldValue?: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void> | Promise<FormikErrors<useSuratKeluarFormValues>>;
  disabled?: boolean;
}> = ({ onSetFieldValue, disabled, path }) => {
  const onDrop = React.useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length) {
      const formData = new FormData();
      formData.append("file", acceptedFiles[0]);
      if (onSetFieldValue) {
        onSetFieldValue("hasFile", true);
        onSetFieldValue("url", acceptedFiles[0].name);
        onSetFieldValue("file", formData);
      }
    }
  }, []);

  const { getInputProps, getRootProps } = useDropzone({
    onDrop,
    accept: ".pdf",
    multiple: false,
    disabled,
    maxFiles: 1,
  });

  return (
    <section>
      <div {...getRootProps({ style: baseStyle })}>
        <input {...getInputProps()} />
        {!!path ? (
          <>
            <FilePdf height={120} width={120} style={{ marginBottom: 32, display: "block" }} />
            <span>{path}</span>
          </>
        ) : (
          <span>"Klik box ini atau drag 'n drop file yang akan di upload"</span>
        )}
      </div>
    </section>
  );
};

const ImageDropzone: React.FC<{
  onAccept: (value: File) => unknown;
  disabled?: boolean;
  placeholder?: string;
}> = ({ onAccept, disabled, placeholder = "Klik box ini atau drag 'n drop image yang akan di upload" }) => {
  const onDrop = React.useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length) {
      onAccept(acceptedFiles[0]);
    }
  }, []);

  const { getInputProps, getRootProps } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
    disabled,
    maxFiles: 1,
  });

  return (
    <section>
      <div {...getRootProps({ style: { ...baseStyle, padding: 0, height: 60, justifyContent: "center" } })}>
        <input {...getInputProps()} />

        <span>{placeholder}</span>
      </div>
    </section>
  );
};

export default Dropzone;
export { ImageDropzone };
