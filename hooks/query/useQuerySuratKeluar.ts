import axios from "axios";
import { useMyQuery } from "../useMyQuery";

const useQuerySuratKeluar = () =>
  useMyQuery("fetchSuratKeluar", async () => {
    try {
      const { data } = await axios.get("/api/v1/surat-keluar");

      return data;
    } catch (e) {
      throw new Error(e.message);
    }
  });

export default useQuerySuratKeluar;
