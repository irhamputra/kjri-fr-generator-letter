import axios from "axios";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import { SuratTugas, SuratTugasRes } from "../../typings/SuratTugas";
import { useMyQuery } from "../useMyQuery";

const useQuerySuratTugas = () => {
  const { pathname } = useRouter();
  const isList = pathname === "/layanan/penugasan/list";

  return useMyQuery(
    ["fetchSuratTugas", isList ? "list" : "create"],
    async () => {
      const { data } = await axios.get<SuratTugas[]>(`/api/v1/penugasan${!isList ? "/create" : ""}`);

      return data ?? null;
    },
    {
      enabled: true,
    }
  );
};

const useQuerySingleSuratTugas = (suratTugasId: string, enabled: boolean = true) => {
  const queryClient = useQueryClient();
  const query = useMyQuery<SuratTugas>(
    ["fetchSingleSurat", suratTugasId],
    async () => {
      const { data } = await axios.get(`/api/v1/surat-tugas/${suratTugasId}`);

      return data;
    },
    {
      enabled: enabled,
    }
  );

  // This code writen to avoid cache invalidation problem
  // I think it's more clean if we define invalidator here to reduce uncertainty
  const invalidateSingleSurat = () => queryClient.invalidateQueries(["fetchSingleSurat", suratTugasId]);
  return { ...query, invalidateSingleSurat };
};

export { useQuerySingleSuratTugas };
export default useQuerySuratTugas;
