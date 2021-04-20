import * as React from "react";
import { NextPage } from "next";
import { People as UserIcon, FileEarmarkWord as ArsipIcon, Tag as GolonganIcon } from "react-bootstrap-icons";
import Card from "../../components/Card";
import { NextSeo } from "next-seo";
import parseCookies from "../../utils/parseCookies";
import apiInstance from "../../utils/firebase/apiInstance";
import { useQueryClient } from "react-query";
import { Auth } from "../../typings/AuthQueryClient";

const Index: NextPage = () => {
  const iconProps = { height: 32, width: 32 };
  const queryClient = useQueryClient();
  const query = queryClient.getQueryData<Auth>("auth");

  if (!query?.isAdmin) throw Error("Invalid permission");

  return (
    <>
      <NextSeo
        title="Pengaturan | Sistem Aplikasi KJRI Frankfurt"
        description="Pengaturan Sistem Aplikasi KJRI Frankfurt"
      />
      <section className="mt-3">
        <h3 className="mx-3">Pengaturan</h3>

        <div className="row">
          {query?.role !== "tu" && (
            <div className="col-md-4 col-sm-6 col-lg-3">
              <Card icon={<UserIcon {...iconProps} />} title="Manage User" link="/pengaturan/manage-user" />
            </div>
          )}
          <div className="col-md-4 col-sm-6 col-lg-3">
            <Card icon={<ArsipIcon {...iconProps} />} title="Manage Arsip" link="/pengaturan/manage-arsip" />
          </div>
          <div className="col-md-4 col-sm-6 col-lg-3">
            <Card icon={<GolonganIcon {...iconProps} />} title="Manage Golongan" link="/pengaturan/manage-golongan" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
