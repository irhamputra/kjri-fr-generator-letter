import axios from "axios";

import { useEffect, useState } from "react";
import { FormRampunganFillInitialValues } from "../../typings/RampunganFill";
import { createRampungan } from "../../utils/createHelper";
import FormRampunganFill from "./FormRampunganFill";
import FormSuratStaff, { ForumSuratStaffInitialValues } from "./FormSuratStaff";

import { toast } from "react-hot-toast";
import useCountUangHarianSPD from "../../hooks/useCountUangHarianSPD";
import { useFormik } from "formik";

const FormSPD: React.FC<{ onPageIndexChange: (val: number) => unknown }> = ({ onPageIndexChange }) => {
  const [activePageIndex, setPageIndex] = useState(0);

  const { setValues, setFieldValue, values, handleSubmit } = useFormik<{
    suratStaff: ForumSuratStaffInitialValues;
    rampunganFill: FormRampunganFillInitialValues;
  }>({
    initialValues: {
      suratStaff: {
        nomorSurat: "",
        fullDayKurs: 0.84,
        namaPegawai: [],
      },
      rampunganFill: {
        pembuatKomitmenName: "",
        pembuatKomitmenNIP: "",
        data: [],
      },
    },
    onSubmit: async (val) => {
      const { data, ...restVal } = val.rampunganFill;
      const { namaPegawai, fullDayKurs } = val.suratStaff;
      try {
        const newValues = {
          nomorSurat: values.suratStaff.nomorSurat,
          fullDayKurs,
          listPegawai: namaPegawai.map((v) => {
            const indexRampungan = data.findIndex(({ nip: nipR }) => nipR === v.pegawai.nip);
            const rampungan = data[indexRampungan].rampungan;

            return {
              ...v,
              uangHarian: countToUER(v.pegawai?.golongan, v.durasi, fullDayKurs),
              destinasi: rampungan,
            };
          }),
          ...restVal,
        };
        const res = await axios.put("/api/v1/penugasan", newValues);
        toast(res.data?.message);
      } catch (e) {
        toast.error(e.message);
        throw new Error(e.message);
      }
    },
  });

  const setSuratStaff = (data: ForumSuratStaffInitialValues) => setValues((val) => ({ ...val, suratStaff: data }));
  const setRampunganFill = (data: FormRampunganFillInitialValues) =>
    setValues((val) => ({ ...val, rampunganFill: data }));

  // TODO : Edit?
  // const { data: editedData = {}, isFetched } = useMyQuery(
  //   ["fetchSingleSurat", editId],
  //   async () => {
  //     const { data } = await axios.get(`/api/v1/surat-tugas/${editId}`);

  //     return data;
  //   },
  //   {
  //     enabled: !!editId,
  //   }
  // );

  const { countToUER } = useCountUangHarianSPD();

  useEffect(() => {
    onPageIndexChange(activePageIndex);
  }, [activePageIndex]);

  switch (activePageIndex) {
    case 0:
      return (
        <FormSuratStaff
          initialValues={values.suratStaff}
          onSave={(val) => {
            const rampunganData = val.namaPegawai?.map(({ pegawai }: { pegawai: any }) => {
              return { nama: pegawai.displayName, nip: pegawai.nip, rampungan: [createRampungan("Frankfurt")] };
            });
            setSuratStaff(val);
            setRampunganFill({ ...values.rampunganFill, data: rampunganData });
            setPageIndex((val) => val + 1);
          }}
        />
      );
    case 1:
      return (
        <FormRampunganFill
          initialValues={values.rampunganFill}
          onSave={async (val) => {
            await setFieldValue("rampunganFill", val);
            handleSubmit();
          }}
          onClickBack={() => setPageIndex((val) => val - 1)}
        />
      );
    default:
      return (
        <FormSuratStaff
          initialValues={values.suratStaff}
          onSave={(val) => {
            const rampunganData = val.namaPegawai?.map(({ pegawai }: { pegawai: any }) => {
              return { nama: pegawai.displayName, nip: pegawai.nip, rampungan: [createRampungan("Frankfurt")] };
            });
            setSuratStaff(val);
            setRampunganFill({ ...values.rampunganFill, data: rampunganData });
            setPageIndex((val) => val + 1);
          }}
        />
      );
  }
};

export default FormSPD;
