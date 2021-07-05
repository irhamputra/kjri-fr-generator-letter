import * as React from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "react-query";
import { FormikErrors } from "formik";
import type { useSuratKeluarFormValues } from "../hooks/form/useSuratKeluarForm";
import { toast } from "react-hot-toast";

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
  onSetFieldValue?: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void> | Promise<FormikErrors<useSuratKeluarFormValues>>;
  disabled?: boolean;
}> = ({ onSetFieldValue, disabled }) => {
  const { mutateAsync } = useMutation(
    "uploadSuratKeluar",
    async (file: FormData) => {
      try {
        if (onSetFieldValue) {
          await onSetFieldValue("file", file);
        }
      } catch (e) {
        throw new Error(e.message);
      }
    },
    {
      onSuccess: async (file) => {
        if (onSetFieldValue) {
          await onSetFieldValue("hasFile", true);
        }
      },
      onError: () => {
        toast.error("Terjadi kesalahan, silahkan coba kembali!");
      },
    }
  );

  const onDrop = React.useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length) {
      const formData = new FormData();
      formData.append("file", acceptedFiles[0]);

      await mutateAsync(formData);
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
        {disabled ? (
          <span>File telah terupload</span>
        ) : (
          <span>Klik box ini atau drag 'n drop file yang akan di upload</span>
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
