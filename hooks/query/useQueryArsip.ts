import { useQuery } from "react-query";
import axios from "axios";

const useQueryArsip = (key?: boolean | string | Record<string, string>) =>
  useQuery(["fetchArsip", key], async () => {
    try {
      const { data } = await axios.get("/api/v1/arsip");

      return data;
    } catch (e) {
      throw new Error(e.message);
    }
  });

export default useQueryArsip;
