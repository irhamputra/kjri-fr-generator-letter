import * as React from "react";
import { NextPage } from "next";
import Link from "next/link";

const Index: NextPage = () => {
  return (
    <>
      <h4>Pengaturan</h4>
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
      </ul>
    </>
  );
};

export default Index;
