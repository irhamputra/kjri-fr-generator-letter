import axios from "axios";
import { useRouter } from "next/router";
import { useMyQuery } from "../useMyQuery";

const useQuerySuratTugas = () => {
  const { pathname } = useRouter();
  const isList = pathname === "/layanan/penugasan/list";

  return useMyQuery(
    "fetchSuratTugas",
    async () => {
      const { data } = await axios.get(`/api/v1/penugasan${!isList ? "/create" : ""}`);

      return data;
    },
    {
      enabled: true,
    }
  );
};

export default useQuerySuratTugas;
