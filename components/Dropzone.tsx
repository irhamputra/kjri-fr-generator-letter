import * as React from "react";
import { useDropzone } from "react-dropzone";
import { FormikErrors } from "formik";
import type { useSuratKeluarFormValues } from "../hooks/form/useSuratKeluarForm";
import toast from "react-hot-toast";
import { Trash } from "react-bootstrap-icons";

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
        toast.success("Surat telah diganti, klik Edit Surat untuk menyimpan perubahan");
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
  const fileName = path.split("/");

  return (
    <section>
      {!!path ? (
        <div className="d-flex flex-column justify-content-center align-items-center position-relative p-3">
          <div
            style={{
              position: "absolute",
              right: 16,
              top: 16,
            }}
          >
            <button
              type="button"
              className="btn btn btn-outline-danger"
              onClick={async () => {
                if (onSetFieldValue) {
                  onSetFieldValue("hasFile", false);
                  onSetFieldValue("url", "");
                  onSetFieldValue("file", undefined);
                }
              }}
            >
              <Trash size={20} />
            </button>
          </div>
          <img src="/images/PDF_file_icon.svg" className="mb-4" width={120} />
          <span style={{ color: "var(--bs-body-color)", fontWeight: "bold" }}>{fileName[fileName.length - 1]}</span>
        </div>
      ) : (
        <div {...getRootProps({ style: { ...baseStyle, position: "relative" } })}>
          <input {...getInputProps()} />
          <span>"Klik box ini atau drag 'n drop file yang akan di upload"</span>
        </div>
      )}
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
