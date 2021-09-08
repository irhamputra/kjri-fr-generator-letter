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
import useWarnUnsavedChange from "../../hooks/useWarnUnsavedChange";
import Stepper from "../Stepper";
import { useQueryClient } from "react-query";

type FormValues = {
  suratStaff: ForumSuratStaffInitialValues;
  rampunganFill: FormRampunganFillInitialValues;
  keterangan: FormKeteranganValues;
};

const FormSPD: React.FC<{
  isEdit?: boolean;
  editData?: Partial<SuratTugasRes>;
  invalidateSingleSurat?: () => Promise<void>;
}> = ({ isEdit, editData, invalidateSingleSurat }) => {
  const [activePageIndex, setPageIndex] = useState(0);
  const { push } = useRouter();
  const queryClient = useQueryClient();

  const rampunganData =
    editData?.listPegawai?.map(({ destinasi, pegawai }) => ({
      nama: pegawai.displayName,
      nip: pegawai.nip,
      uid: pegawai.uid,
      rampungan: destinasi,
    })) ?? [];

  const keteranganData =
    editData?.listPegawai?.map(({ pegawai, keterangan }) => ({
      nama: pegawai.displayName,
      nip: pegawai.nip,
      uid: pegawai.uid,
      rincian: keterangan.rincian,
    })) ?? [];

  const initialValues: FormValues = isEdit
    ? {
        suratStaff: {
          nomorSurat: editData?.nomorSurat ?? "",
          fullDayKurs: editData?.fullDayKurs ?? 0.84,
          namaPegawai: editData?.listPegawai ?? [],
        },
        rampunganFill: {
          pembuatKomitmenName: editData?.pembuatKomitmen?.name ?? "",
          pembuatKomitmenNIP: editData?.pembuatKomitmen?.nip ?? "",
          data: rampunganData,
        },
        keterangan: {
          data: keteranganData,
        },
      }
    : FORM_INITIAL_VALUES;

  const { setValues, setFieldValue, values, handleSubmit, dirty } = useFormik<FormValues>({
    initialValues,
    onSubmit: async (val) => {
      const { data, ...restVal } = val.rampunganFill;
      const { namaPegawai, fullDayKurs } = val.suratStaff;
      try {
        const newValues: Omit<SuratTugasRes, "tujuanDinas" | "suratTugasId" | "createdAt" | "editedAt"> = {
          ...restVal,
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
          downloadUrl: {},
        };
        const res = await axios.put("/api/v1/penugasan", newValues);
        toast(res.data?.message);
        if (invalidateSingleSurat) {
          invalidateSingleSurat();
        }
        queryClient.invalidateQueries(["fetchSuratTugas", "list"]);
        finishEditing();
        push("/layanan/penugasan/list");
      } catch (e) {
        toast.error(e.message);
        throw new Error(e.message);
      }
    },
  });
  const { finishEditing } = useWarnUnsavedChange(dirty);
  const { countToUER } = useCountUangHarianSPD();

  const renderPage = () => {
    switch (activePageIndex) {
      case 0:
        return (
          <FormSuratStaff
            initialValues={values.suratStaff}
            isEdit={isEdit}
            onSave={(val) => {
              let rampunganData: { nama: string; nip: string; rampungan: any; uid: string }[] = [];
              let keteranganData: { nama: string; nip: string; rincian: string; uid: string }[] = [];

              val.namaPegawai?.forEach(({ pegawai }: { pegawai: Pegawai }) => {
                const oldRampunganData = values.rampunganFill.data.filter(({ uid }) => uid === pegawai.uid)[0];
                const oldKeteranganData = values.keterangan.data.filter(({ uid }) => uid === pegawai.uid)[0];

                // If the pegawai is new, create blank value instead of pushing old Data
                if (!oldRampunganData) {
                  rampunganData.push({
                    nama: pegawai.displayName,
                    nip: pegawai.nip,
                    uid: pegawai.uid,
                    rampungan: [createRampungan("Frankfurt")],
                  });
                } else {
                  rampunganData.push(oldRampunganData);
                }

                if (!oldKeteranganData) {
                  keteranganData.push({
                    nama: pegawai.displayName,
                    uid: pegawai.uid,
                    nip: pegawai.nip,
                    rincian: "",
                  });
                } else {
                  keteranganData.push(oldKeteranganData);
                }
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

  const setSuratStaff = (data: ForumSuratStaffInitialValues) => setValues((val) => ({ ...val, suratStaff: data }));

  return (
    <>
      <div
        style={{
          background: "#f8f8f8",
          borderRadius: 4,
          width: "100%",
        }}
        className="p-3"
      >
        <Stepper data={STEPPER_OPTION} activeIndex={activePageIndex} />
      </div>
      <div className="row p-3 mb-5">{renderPage()}</div>
    </>
  );
};

const FORM_INITIAL_VALUES = {
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
};

const STEPPER_OPTION = [
  { number: 1, text: "Nomor Surat dan Staff" },
  { number: 2, text: "Destinasi" },
  { number: 3, text: "Keterangan" },
];

export default FormSPD;
