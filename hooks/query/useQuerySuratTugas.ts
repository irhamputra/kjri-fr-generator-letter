import { useQuery } from "react-query";
import axios from "axios";

const useQuerySuratTugas = () =>
  useQuery(
    "fetchSuratTugas",
    async () => {
      const { data } = await axios.get("/api/v1/penugasan");

      return data;
    },
    {
      enabled: true,
    }
  );

export default useQuerySuratTugas;
