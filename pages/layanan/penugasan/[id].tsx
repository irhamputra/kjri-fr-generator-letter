import * as React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { SuratTugasRes } from "../../../typings/SuratTugas";
import FormSPD from "../../../components/forms/SPD";
import { useQuerySingleSuratTugas } from "../../../hooks/query/useQuerySuratTugas";

const SuratPenugasanId: NextPage = () => {
  const { query, back } = useRouter();
  const {
    data: dataEdit = {},
    isLoading: isEditLoading,
    invalidateSingleSurat,
  } = useQuerySingleSuratTugas((query.id as string) ?? "", !!query.id);

  if (isEditLoading) return <h4>Loading...</h4>;

  return (
    <section style={{ marginTop: "6rem" }}>
      {query.edit ? (
        <>
          <h3 style={{ marginBottom: 24 }}>Surat Penugasan Perjalanan Dinas (SPD)</h3>
          <FormSPD editData={dataEdit} isEdit invalidateSingleSurat={invalidateSingleSurat} />
        </>
      ) : (
        <DetailSuratPenugasan data={!isEditLoading ? dataEdit : {}} back={back} />
      )}
    </section>
  );
};

const DetailSuratPenugasan: React.FC<{ data: Partial<SuratTugasRes>; back: () => void }> = ({ data, back }) => {
  return (
    <>
      <button onClick={() => back()} className="btn-dark btn my-3">
        Kembali ke list
      </button>

      <div className="row">
        <div className="col-2">
          <h5>Nomor Surat</h5>
          <p>{data.nomorSurat}</p>
        </div>

        <div className="col">
          <h5>Perihal Dinas</h5>
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
    </>
  );
};

export default SuratPenugasanId;
