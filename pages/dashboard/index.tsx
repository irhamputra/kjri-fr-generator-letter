import * as React from "react";
import { NextPage } from "next";
import Card from "../../components/Card";
import {
  FileEarmarkArrowUp as SuratKeluarIcon,
  FileMedical as SuratKeputusanIcon,
  FileEarmarkRichtext as SuratPenugasanIcon,
  FileEarmarkText as SuratTugasIcon,
} from "react-bootstrap-icons";

const Dashboard: NextPage = () => {
  const iconProps = { height: 32, width: 32 };
  return (
    <>
      <section className="container-fluid">
        <h3 className="mt-3 mx-3">Layanan Sistem Aplikasi Surat</h3>
        <div className="row mt-3">
          <div className="col-md-4 col-sm-6 col-lg-3">
            <Card
              icon={<SuratKeluarIcon {...iconProps} />}
              title="Surat Keluar"
              link="/layanan/surat-keluar"
            />
          </div>
          <div className="col-md-4 col-sm-6 col-lg-3">
            <Card
              icon={<SuratKeputusanIcon {...iconProps} />}
              title="Surat Keputusan"
              link="/layanan/surat-keputusan"
            />
          </div>
          <div className="col-md-4 col-sm-6 col-lg-3">
            <Card
              icon={<SuratTugasIcon {...iconProps} />}
              title="Surat Tugas (SPPD)"
              link="/layanan/surat-tugas"
            />
          </div>
          <div className="col-md-4 col-sm-6 col-lg-3">
            <Card
              icon={<SuratPenugasanIcon {...iconProps} />}
              title="Surat Penugasan(SPD)"
              link="/layanan/penugasan"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
