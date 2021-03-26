import * as React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import axios from "axios";

const SuratPenugasanId: NextPage = () => {
  const { query, push } = useRouter();

  const { data, isLoading } = useQuery("fetchSingleSurat", async () => {
    const { data } = await axios.get(`/api/v1/surat-tugas/${query.id}`);

    return data;
  });

  if (isLoading) return <h4>Loading...</h4>;

  return (
    <>
      <button
        onClick={async () => {
          await push("/layanan/penugasan/list");
        }}
        className="btn-dark btn mt-3"
      >
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
            ? data.listPegawai.map((v) => (
                <tr key={v.pegawai.uid}>
                  <td scope="row">{v.pegawai.nip}</td>
                  <td>{v.pegawai.displayName}</td>
                  <td>{v.pegawai.golongan}</td>
                  <td>{v.pegawai.jabatan}</td>
                  <td>{v.durasi} hari</td>
                  <td>{v.uangHarian}</td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </>
  );
};

export default SuratPenugasanId;
