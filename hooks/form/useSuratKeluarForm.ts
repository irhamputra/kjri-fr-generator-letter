import axios from "axios";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { v4 } from "uuid";
import { object } from "yup";
import createSchema from "../../utils/validation/schema";
import useUpdateSuratKeluarMutation from "../mutation/useUpdateSuratKeluarMutation";
import useQueryJenisSurat from "../query/useQueryJenisSurat";
import { useQuerySuratKeluarStats } from "../query/useQuerySuratKeluar";
import useWarnUnsavedChange from "../useWarnUnsavedChange";

export interface GenerateNomorValues {
  author: string;
  arsipId: string;
  jenisSurat: string;
  id: string;
}

export interface useSuratKeluarFormValues {
  recipient: string;
  content: string;
  jenisSurat: string;
  nomorSurat: string;
  arsipId: string;
  id: string;
  author: string;
  hasFile: boolean;
  file?: FormData | undefined;
  url?: string;
}

const useSuratKeluarForm = (initialValues: useSuratKeluarFormValues, backUrl: string) => {
  const { data: listJenisSurat } = useQueryJenisSurat();
  const { mutateAsync: updateSuratKeluar } = useUpdateSuratKeluarMutation();
  const { data: statsData, isFetching: isFetchingStats } = useQuerySuratKeluarStats();
  const queryClient = useQueryClient();
  const { push } = useRouter();

  const { values, setFieldValue, dirty, ...restFormik } = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: object().shape(createSchema(initialValues)),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(true);
      let { file, ...rest } = values;

      // Append nomorSurat for file naming purpose

      try {
        let url = "";
        if (file) {
          file.append("nomorSurat", rest.nomorSurat);
          const { data } = await axios.post("/api/v1/surat-keluar/upload", file, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          url = data.url;
        }

        await updateSuratKeluar(url ? { ...rest, url } : rest);
        await queryClient.invalidateQueries(["fetchSuratKeluarId", values.id]);
      } catch (e) {
        toast.error("Gagal membuat surat keluar!");
        throw new Error(e.message);
      }

      finishEditing();
      resetForm();
      setSubmitting(false);
    },
  });

  const { finishEditing } = useWarnUnsavedChange(dirty, async () => {
    await push(backUrl ?? "/layanan/surat-keluar/list");
  });

  const disableGenerateNomor = !values.arsipId || !values.jenisSurat || isFetchingStats;

  const mutation = useMutation(
    "createSuratKeluar",
    async (values: GenerateNomorValues) => {
      const { arsipId, ...restValues } = values;
      const labelJenisSurat = listJenisSurat?.find((v: { label: string }) => v.label === restValues.jenisSurat).label;
      const { data: statsNew } = await axios.get("/api/v1/surat-keluar/stats");

      const nomorSurat = createNomorSurat(statsNew.counter, arsipId, labelJenisSurat);

      const {
        data: { message, data },
      } = await axios.post("/api/v1/surat-keluar", { nomorSurat, ...restValues });

      await setFieldValue("nomorSurat", data?.nomorSurat);
      await setFieldValue("author", data?.author);
      await setFieldValue("id", data?.id);

      toast.success(message);
    },
    {
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: async () => {
        await setFieldValue("id", "");
        await setFieldValue("nomorSurat", "");
        await setFieldValue("author", "");
      },
    }
  );

  const handleNomorSurat = async () => {
    const { arsipId, jenisSurat, author } = values;

    if (!arsipId || !jenisSurat) return await setFieldValue("nomorSurat", "");

    try {
      const nomorSurat = createNomorSurat(statsData.counter, arsipId, jenisSurat);
      const id = v4();
      await setFieldValue("nomorSurat", nomorSurat);
      await mutation.mutateAsync({ arsipId, jenisSurat, author, id });
    } catch (e) {
      throw new Error(e.message);
    }
  };

  const createNomorSurat = (counter: number, arsipId: string, labelJenisSurat: string) => {
    const incrementNumber = `00${counter + 1}`;
    const thisMonth = dayjs().month() + 1;
    const thisYear = dayjs().year();

    let jenisSurat = "";
    let suffixFRA = false;
    let suratKeputusan = "";

    if (labelJenisSurat === "Surat Pengumuman") {
      jenisSurat = "PEN";
    }

    if (labelJenisSurat === "Surat Keterangan") {
      jenisSurat = "SUKET";
    }

    if (!["Nota Dinas", "Surat Edaran", "Surat Keputusan"].includes(labelJenisSurat)) {
      suffixFRA = true;
    }

    if (labelJenisSurat === "Surat Keputusan") {
      suratKeputusan = "SK-FRA";
    }

    const nomorSurat = `${incrementNumber}/${suratKeputusan ? `${suratKeputusan}/` : ""}${
      jenisSurat ? `${jenisSurat}/` : ""
    }${arsipId}/${thisMonth}/${thisYear}${suffixFRA ? "/FRA" : ""}`;

    return nomorSurat;
  };

  return {
    handleNomorSurat,
    createNomorSurat,
    values,
    setFieldValue,
    disableGenerateNomor,
    ...mutation,
    ...restFormik,
  };
};

export default useSuratKeluarForm;
