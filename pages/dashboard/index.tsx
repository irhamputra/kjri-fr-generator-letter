import * as React from "react";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import DashboardLayout from "../../components/layout/Dashboard";
import parseCookies from "../../utils/parseCookies";
import Card from "../../components/Card";

const Dashboard: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  return (
    <DashboardLayout>
      <div className="row mt-3">
        <h3 className="mb-3">Layanan Sistem Aplikasi Surat</h3>
        <div className="col-3">
          <Card
            title="Surat Tugas"
            subtitle="Lorem ipsum dolor"
            content="sit amet"
            link="surat-tugas"
          />
        </div>
        <div className="col-3">
          <Card
            title="Surat Tugas"
            subtitle="Lorem ipsum dolor"
            content="sit amet"
            link="surat-tugas"
          />
        </div>
        <div className="col-3">
          <Card
            title="Surat Tugas"
            subtitle="Lorem ipsum dolor"
            content="sit amet"
            link="surat-tugas"
          />
        </div>
        <div className="col-3">
          <Card
            title="Surat Tugas"
            subtitle="Lorem ipsum dolor"
            content="sit amet"
            link="surat-tugas"
          />
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
