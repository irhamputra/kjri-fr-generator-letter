import * as React from "react";
import { NextPage } from "next";
import DashboardLayout from "../../components/layout/Dashboard";
import { useFormik } from "formik";

const generateArchive = () => {
  return Array.from({ length: 10 }).map((_, i) => {
    function convertToRoman(num) {
      const roman = {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1,
      };
      let str = "";

      for (let i of Object.keys(roman)) {
        const q = Math.floor(num / roman[i]);
        num -= q * roman[i];
        str += i.repeat(q);
      }

      return str;
    }

    return (
      <option
        key={i + 1}
        value={convertToRoman(i + 1)}
        label={convertToRoman(i + 1)}
      />
    );
  });
};

const SuratTugas: NextPage = () => {
  const { handleChange, handleSubmit, values, setValues } = useFormik({
    initialValues: {
      nomorSurat: "",
      tujuanDinas: "",
      arsipId: "",
    },
    onSubmit: (values) => console.log(values),
  });

  const onCounterId = () => {
    // TODO: get data from firebase and sum all list and add 1
    console.log("Counter", values.arsipId);
  };

  return (
    <DashboardLayout>
      <h1>Surat Tugas (SPD)</h1>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <label className="form-label">Nomor Surat Arsip</label>

          <div className="col">
            <select
              onChange={handleChange}
              name="arsipId"
              className="form-select"
              id="records"
              value={values.arsipId}
            >
              <option value="" label="Pilih Jenis Arsip" />
              {generateArchive()}
            </select>
          </div>
          <div className="col">
            <input
              className="form-control"
              name="nomorSurat"
              onChange={handleChange}
              value={values.nomorSurat}
              disabled
            />
          </div>
          <div className="col">
            <button
              type="button"
              onClick={onCounterId}
              className="btn btn-dark"
            >
              Generate Nomor Surat
            </button>
          </div>
        </div>

        <div className="mt-3">
          <label className="form-label">Nama Dinas / Tujuan Dinas</label>
          <input
            className="form-control"
            name="tujuanDinas"
            onChange={handleChange}
            value={values.tujuanDinas}
          />
        </div>

        <button className="btn btn-dark mt-3" type="submit">
          Submit
        </button>
      </form>
    </DashboardLayout>
  );
};

export default SuratTugas;
