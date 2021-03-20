import * as React from "react";
import { NextPage } from "next";
import DashboardLayout from "../../components/layout/Dashboard";
import Link from "next/link";

const Index: NextPage = () => {
  return (
    <DashboardLayout>
      <h4>Pengaturan</h4>
      <ul>
        <li>
          <Link href="/pengaturan/manage-arsip">Manage Arsip</Link>
        </li>
        <li>
          <Link href="/pengaturan/manage-departemen">Manage Departemen</Link>
        </li>
      </ul>
    </DashboardLayout>
  );
};

export default Index;
