import { useQuery } from "react-query";
import axios from "axios";

const useQuerySuratKeluar = () =>
  useQuery("fetchSuratKeluar", async () => {
    try {
      const { data } = await axios.get("/api/v1/surat-keluar");

      return data;
    } catch (e) {
      throw new Error(e.message);
    }
  });

export default useQuerySuratKeluar;
