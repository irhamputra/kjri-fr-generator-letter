import { NextPage } from "next";
import useQuerySuratPerjalanan from "../../hooks/query/useQuerySuratPerjalanan";
import { NextSeo } from "next-seo";
import * as React from "react";
import { Printer } from "react-bootstrap-icons";
// import usePrintFile from "../../hooks/usePrintFile";

const SuratPerjalanan: NextPage = () => {
  const { data, isLoading } = useQuerySuratPerjalanan();
  // const { mutateAsync } = usePrintFile();

  if (isLoading) return <p>Loading...</p>;

  const handlePrint = async (id) => {
    console.log({ id });
    // await mutateAsync(id);
  };

  // TODO: tambahin table surat perjalanan
  return (
    <>
      <NextSeo
        title="Surat Perjalanan | Sistem Aplikasi KJRI Frankfurt"
        description="Dashboard Arsip Sistem Aplikasi KJRI Frankfurt"
      />
      <section className="mt-3">
        <h3>List Surat Perjalanan</h3>
        <ul>
          {data?.map?.((v) => {
            return (
              <li key={v.suratTugasId}>
                {v.suratTugasId}
                <button className="btn btn-outline-primary" onClick={() => handlePrint(v.suratTugasId)}>
                  <Printer size={25} />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
};

export default SuratPerjalanan;
