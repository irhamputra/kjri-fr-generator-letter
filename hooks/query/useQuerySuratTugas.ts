import axios from "axios";
import { useRouter } from "next/router";
import { SuratTugasRes } from "../../typings/SuratTugas";
import { useMyQuery } from "../useMyQuery";

const useQuerySuratTugas = () => {
  const { pathname } = useRouter();
  const isList = pathname === "/layanan/penugasan/list";

  return useMyQuery(
    "fetchSuratTugas",
    async () => {
      const { data } = await axios.get(`/api/v1/penugasan${!isList ? "/create" : ""}`);

      return data ?? null;
    },
    {
      enabled: true,
    }
  );
};

const useQuerySingleSuratTugas = (suratTugasId: string, enabled: boolean = true) => {
  return useMyQuery<SuratTugasRes>(
    ["fetchSingleSurat", suratTugasId],
    async () => {
      const { data } = await axios.get(`/api/v1/surat-tugas/${suratTugasId}`);

      return data;
    },
    {
      enabled: enabled,
    }
  );
};

export { useQuerySingleSuratTugas };
export default useQuerySuratTugas;
