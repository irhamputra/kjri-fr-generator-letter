import * as React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import axios from "axios";
import Penugasan from ".";
import { useMyQuery } from "../../../hooks/useMyQuery";

const SuratPenugasanId: NextPage = () => {
  const { query, back } = useRouter();

  const { data, isLoading } = useMyQuery(
    ["fetchSingleSurat", query.id],
    async () => {
      const { data } = await axios.get(`/api/v1/surat-tugas/${query.id}`);

      return data;
    },
    {
      enabled: !query.edit,
    }
  );

  if (isLoading) return <h4>Loading...</h4>;

  return (
    <section style={{ marginTop: "6rem" }}>
      <button onClick={() => back()} className="btn-dark btn my-3">
        Kembali ke list
      </button>

      <div className="row">
        <div className="col-2">
          <h5>Nomor Surat</h5>
          <p>{data.nomorSurat}</p>
        </div>

        <div className="col">
          <h5>Tujuan Dinas</h5>
          <p>{data.tujuanDinas}</p>
        </div>
      </div>

      <hr />

      <table className="table caption-top mt-3">
        <caption>List Pegawai</caption>
        <thead>
          <tr>
            <th scope="col">NIP</th>
            <th scope="col">Nama</th>
            <th scope="col">Golongan</th>
            <th scope="col">Bidang</th>
            <th scope="col">Durasi</th>
            <th scope="col">Uang Harian</th>
          </tr>
        </thead>
        <tbody>
          {data?.listPegawai
            ? data.listPegawai.map(
                (v: {
                  pegawai: {
                    uid: string;
                    nip: string;
                    displayName: string;
                    golongan: string;
                    jabatan: string;
                  };
                  durasi: string;
                  uangHarian: string;
                }) => (
                  <tr key={v.pegawai.uid}>
                    <td scope="row">{v.pegawai.nip}</td>
                    <td>{v.pegawai.displayName}</td>
                    <td>{v.pegawai.golongan}</td>
                    <td>{v.pegawai.jabatan}</td>
                    <td>{v.durasi} hari</td>
                    <td>{v.uangHarian}</td>
                  </tr>
                )
              )
            : null}
        </tbody>
      </table>
    </section>
  );
};

export default SuratPenugasanId;
