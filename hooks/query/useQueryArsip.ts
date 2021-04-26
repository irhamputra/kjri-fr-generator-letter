import axios from "axios";
import { useMyQuery } from "../useMyQuery";

const useQueryArsip = () =>
  useMyQuery("fetchArsip", async () => {
    try {
      const { data } = await axios.get("/api/v1/arsip");

      return data;
    } catch (e) {
      throw new Error(e.message);
    }
  });

export default useQueryArsip;
