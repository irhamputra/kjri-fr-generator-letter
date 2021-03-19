import * as React from "react";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import DashboardLayout from "../../components/layout/Dashboard";
import parseCookies from "../../utils/parseCookies";
import Link from "next/link";

const Dashboard: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  return (
    <DashboardLayout>
      <div className="row mt-3">
        <h3 className="mb-3">Layanan Sistem Aplikasi Surat</h3>
        <ul>
          <li>
            <Link href="/layanan/surat-tugas">Surat Tugas (SPD)</Link>
          </li>
          <li>
            <Link href="/layanan/penugasan">Surat Penugasan (SPPD)</Link>
          </li>
        </ul>
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
