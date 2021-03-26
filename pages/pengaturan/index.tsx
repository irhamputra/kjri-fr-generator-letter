import * as React from "react";
import { NextPage } from "next";
import {
  People as UserIcon,
  FileEarmarkWord as ArsipIcon,
  Collection as DepartemenIcon,
  Tag as GolonganIcon,
} from "react-bootstrap-icons";
import Card from "../../components/Card";
import { NextSeo } from "next-seo";

const Index: NextPage = () => {
  const iconProps = { height: 32, width: 32 };

  return (
    <>
      <NextSeo
        title="Pengaturan | Sistem Aplikasi KJRI Frankfurt"
        description="Pengaturan Sistem Aplikasi KJRI Frankfurt"
      />
      <section className="container-fluid">
        <h3 className="mx-3">Pengaturan</h3>

        <div className="row">
          <div className="col-md-4 col-sm-6 col-lg-3">
            <Card
              icon={<UserIcon {...iconProps} />}
              title="Manage User"
              link="/pengaturan/manage-user"
            />
          </div>
          <div className="col-md-4 col-sm-6 col-lg-3">
            <Card
              icon={<ArsipIcon {...iconProps} />}
              title="Manage Arsip"
              link="/pengaturan/manage-arsip"
            />
          </div>
          <div className="col-md-4 col-sm-6 col-lg-3">
            <Card
              icon={<DepartemenIcon {...iconProps} />}
              title="Manage Departemen"
              link="/pengaturan/manage-departemen"
            />
          </div>
          <div className="col-md-4 col-sm-6 col-lg-3">
            <Card
              icon={<GolonganIcon {...iconProps} />}
              title="Manage Golongan"
              link="/pengaturan/manage-golongan"
            />
          </div>
        </div>
      </section>

      {/* <h3 className="mb-3">Layanan Sistem Aplikasi Surat</h3>
      <ul>
        <li>
          <Link href="/pengaturan/manage-user">Manage User</Link>
        </li>
        <li>
          <Link href="/pengaturan/manage-arsip">Manage Arsip</Link>
        </li>
        <li>
          <Link href="/pengaturan/manage-departemen">Manage Departemen</Link>
        </li>
        <li>
          <Link href="/pengaturan/manage-golongan">Manage Golongan</Link>
        </li>
      </ul> */}
    </>
  );
};

export default Index;
