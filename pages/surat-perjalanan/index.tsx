import { NextPage } from "next";
import useQuerySuratPerjalanan from "../../hooks/query/useQuerySuratPerjalanan";

const SuratPerjalanan: NextPage = () => {
  const { data, isLoading } = useQuerySuratPerjalanan();
  if (isLoading) return <p>Loading...</p>;

  // TODO: tambahin table surat perjalanan
  return (
    <>
      <h1>List Surat Perjalanan</h1>
      <ul>
        {data?.map?.((v) => {
          return <li key={v.suratTugasId}>{v.suratTugasId}</li>;
        })}
      </ul>
    </>
  );
};

export default SuratPerjalanan;
