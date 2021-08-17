import axios from "axios";

import { useEffect, useState } from "react";
import { FormRampunganFillInitialValues } from "../../typings/RampunganFill";
import { createRampungan } from "../../utils/createHelper";
import FormRampunganFill from "./FormRampunganFill";
import FormSuratStaff, { ForumSuratStaffInitialValues } from "./FormSuratStaff";

import { toast } from "react-hot-toast";
import useCountUangHarianSPD from "../../hooks/useCountUangHarianSPD";
import { useFormik } from "formik";
import FormKeterangan, { FormKeteranganValues } from "./FormKeterangan";
import { SuratTugasRes } from "../../typings/SuratTugas";

const FormSPD: React.FC<{ onPageIndexChange: (val: number) => unknown }> = ({ onPageIndexChange }) => {
  const [activePageIndex, setPageIndex] = useState(0);

  const { setValues, setFieldValue, values, handleSubmit } = useFormik<{
    suratStaff: ForumSuratStaffInitialValues;
    rampunganFill: FormRampunganFillInitialValues;
    keterangan: FormKeteranganValues;
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
      keterangan: {
        data: [],
      },
    },
    onSubmit: async (val) => {
      const { data, ...restVal } = val.rampunganFill;

      const { namaPegawai, fullDayKurs } = val.suratStaff;
      try {
        const newValues: Omit<SuratTugasRes, "tujuanDinas" | "suratTugasId"> = {
          nomorSurat: values.suratStaff.nomorSurat,
          fullDayKurs,
          listPegawai: namaPegawai.map((v) => {
            const indexRampungan = data.findIndex(({ nip: nipR }) => nipR === v.pegawai.nip);
            const rampungan = data[indexRampungan].rampungan;
            const keterangan = val.keterangan.data.filter(({ nip }) => nip === v.pegawai.nip)[0];

            return {
              ...v,
              uangHarian: countToUER(v.pegawai?.golongan, v.durasi, fullDayKurs),
              destinasi: rampungan,
              keterangan: {
                rincian: keterangan.rincian,
              },
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
            let rampunganData: { nama: string; nip: string; rampungan: any }[] = [];
            let keteranganData: { nama: string; nip: string; rincian: "" }[] = [];

            val.namaPegawai?.forEach(({ pegawai }: { pegawai: any }) => {
              rampunganData.push({
                nama: pegawai.displayName,
                nip: pegawai.nip,
                rampungan: [createRampungan("Frankfurt")],
              });
              keteranganData.push({
                nama: pegawai.displayName,
                nip: pegawai.nip,
                rincian: "",
              });
            });

            setSuratStaff(val);

            // Reset default value of rampunganFill and keterangan
            setValues((val) => ({
              ...val,
              rampunganFill: { ...values.rampunganFill, data: rampunganData },
              keterangan: { ...values.keterangan, data: keteranganData },
            }));
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

            setPageIndex((val) => val + 1);
          }}
          onClickBack={() => setPageIndex((val) => val - 1)}
        />
      );
    case 2:
      return (
        <FormKeterangan
          initialValues={values.keterangan}
          onSave={async (val) => {
            await setFieldValue("keterangan", val);
            handleSubmit();
          }}
          onClickBack={() => setPageIndex((val) => val - 1)}
        />
      );
    default:
      return <div />;
  }
};

export default FormSPD;
