import * as React from "react";
import { NextPage } from "next";
import DashboardLayout from "../../components/layout/Dashboard";
import { useFormik } from "formik";

const Penugasan: NextPage = () => {
  const {} = useFormik({
    initialValues: {
      nomorDinas: "",
      namaPegawai: [],
    },
    onSubmit: (values) => console.log(values),
  });

  return (
    <DashboardLayout>
      <h1>Surat Penugasan Perjalanan Dinas (SPPD)</h1>
    </DashboardLayout>
  );
};

export default Penugasan;
