import axios from "axios";

import React, { useEffect, useState } from "react";
import { FormRampunganFillInitialValues } from "../../typings/RampunganFill";
import { createRampungan } from "../../utils/createHelper";
import FormRampunganFill from "./FormRampunganFill";
import FormSuratStaff, { ForumSuratStaffInitialValues } from "./FormSuratStaff";

import { toast } from "react-hot-toast";
import useCountUangHarianSPD from "../../hooks/useCountUangHarianSPD";
import { useFormik } from "formik";
import FormKeterangan, { FormKeteranganValues } from "./FormKeterangan";
import { SuratTugasRes } from "../../typings/SuratTugas";
import { Pegawai } from "../../typings/Pegawai";
import { useRouter } from "next/router";

const FormSPD: React.FC<{ onPageIndexChange: (val: number) => unknown }> = ({ onPageIndexChange }) => {
  const [activePageIndex, setPageIndex] = useState(0);
  const { push } = useRouter();

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
            const indexRampungan = data.findIndex(({ uid: id }) => id === v.pegawai.uid);
            const rampungan = data[indexRampungan].rampungan;
            const keterangan = val.keterangan.data.filter(({ uid: id }) => id === v.pegawai.uid)[0];

            // Only put necessary code here
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
        push("/layanan/penugasan/list");
      } catch (e) {
        toast.error(e.message);
        throw new Error(e.message);
      }
    },
  });

  const setSuratStaff = (data: ForumSuratStaffInitialValues) => setValues((val) => ({ ...val, suratStaff: data }));

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
            let rampunganData: { nama: string; nip: string; rampungan: any; uid: string }[] = [];
            let keteranganData: { nama: string; nip: string; rincian: ""; uid: string }[] = [];

            val.namaPegawai?.forEach(({ pegawai }: { pegawai: Pegawai }) => {
              rampunganData.push({
                nama: pegawai.displayName,
                nip: pegawai.nip,
                uid: pegawai.uid,
                rampungan: [createRampungan("Frankfurt")],
              });
              keteranganData.push({
                nama: pegawai.displayName,
                uid: pegawai.uid,
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
