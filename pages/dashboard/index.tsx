import * as React from "react";
import { GetServerSideProps, NextPage } from "next";
import Card from "../../components/Card";
import {
  FileEarmarkArrowUp as SuratKeluarIcon,
  FileEarmarkRichtext as SuratPenugasanIcon,
  FileEarmarkText as SuratTugasIcon,
} from "react-bootstrap-icons";
import { NextSeo } from "next-seo";
import useRefetchToken from "../../hooks/useRefetchToken";
import axios from "axios";
import parseCookies from "../../utils/parseCookies";

const iconProps = { height: 32, width: 32 };

const Dashboard: NextPage<{ isAdmin: boolean }> = ({ isAdmin }) => {
  useRefetchToken();

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
          {isAdmin && (
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
      </section>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // TODO: fetch email user
  const cookie = parseCookies(req);

  if (!cookie["KJRIFR-U"]) return { props: {} };

  const BASE_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://sistem-nomor-surat-kjri-frankfurt.vercel.app";

  const idToken = cookie["KJRIFR-U"];

  const {
    data: { email, isAdmin },
  } = await axios.get<{}, { data: { email: string; isAdmin: boolean } }>(`${BASE_URL}/api/v1/user`, {
    headers: {
      authorization: `Bearer ${idToken}`,
    },
  });

  return {
    props: {
      email,
      isAdmin,
    },
  };
};

export default Dashboard;
