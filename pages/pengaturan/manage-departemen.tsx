import * as React from "react";
import { NextPage } from "next";
import { NextSeo } from "next-seo";

const ManageDepartemen: NextPage = () => {
  return (
    <section className="mt-3">
      <NextSeo
        title="Manage Departmen | Sistem Aplikasi KJRI Frankfurt"
        description="Manage Departmen Sistem Aplikasi KJRI Frankfurt"
      />
      <h4>Manage Departemen</h4>
    </section>
  );
};

export default ManageDepartemen;
