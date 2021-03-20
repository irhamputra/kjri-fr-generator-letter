import * as React from "react";
import { GetServerSideProps, NextPage } from "next";
import DashboardLayout from "../../components/layout/Dashboard";
import parseCookies from "../../utils/parseCookies";
import Card from "../../components/Card";

const Dashboard: NextPage = () => {
  return (
    <DashboardLayout>
      <div className="row mt-3">
        <h3 className="mb-3">Layanan Sistem Aplikasi Surat</h3>
        <div className="col-2">
          <Card title="Surat Tugas (SPPD)" link="surat-tugas" />
        </div>
        <div className="col-2">
          <Card title="Surat Penugasan(SPD)" link="penugasan" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookie = parseCookies(req);

  return {
    props: {
      cookie,
    },
  };
};

export default Dashboard;
