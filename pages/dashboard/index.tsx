import * as React from "react";
import { NextPage } from "next";
import Card from "../../components/Card";
import {
  FileEarmarkArrowUp as SuratKeluarIcon,
  FileEarmarkRichtext as SuratPenugasanIcon,
  FileEarmarkText as SuratTugasIcon,
} from "react-bootstrap-icons";
import { NextSeo } from "next-seo";
import useRefetchToken from "../../hooks/useRefetchToken";
import { useQueryClient } from "react-query";
import { Auth } from "../../typings/AuthQueryClient";
import useQuerySuratKeluar from "../../hooks/query/useQuerySuratKeluar";
import styles from "../../styles/Card.module.css";

const iconProps = { height: 32, width: 32 };

const Dashboard: NextPage = () => {
  useRefetchToken();
  const queryClient = useQueryClient();
  const query = queryClient.getQueryData<Auth>("auth");

  const { data: listSuratKeluar, isLoading } = useQuerySuratKeluar();

  const total = listSuratKeluar?.listSurat?.length ?? 0;

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <NextSeo
        title="Dashboard | Sistem Aplikasi KJRI Frankfurt"
        description="Dashboard Arsip Sistem Aplikasi KJRI Frankfurt"
      />
      <section className="mt-3">
        <h4 className="mx-3">Layanan Sistem Aplikasi Surat</h4>
        <div className="row mt-3">
          <div className="col-md-4 col-sm-6 col-lg-3">
            <Card icon={<SuratKeluarIcon {...iconProps} />} title="Surat Keluar" link="/layanan/surat-keluar/list" />
          </div>
          {query?.isAdmin && (
            <>
              <div className="col-md-4 col-sm-6 col-lg-3">
                <Card icon={<SuratTugasIcon {...iconProps} />} title="Surat Tugas (ST)" link="/layanan/surat-tugas" />
              </div>
              <div className="col-md-4 col-sm-6 col-lg-3">
                <Card
                  icon={<SuratPenugasanIcon {...iconProps} />}
                  title="Surat Penugasan (SPD)"
                  link="/layanan/penugasan/list"
                />
              </div>
            </>
          )}
        </div>

        <h4 className="mx-3 mt-3">Statistik</h4>

        <div className="row">
          <div className="col-md-4 col-sm-6 col-lg-3">
            <div className="card-body">
              <div className="card bg-dark text-white p-3">
                <small className="card-title fw-bold">Total Surat Keluar</small>
                <h3 className="text-end">
                  {total} <small>Surat</small>
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
