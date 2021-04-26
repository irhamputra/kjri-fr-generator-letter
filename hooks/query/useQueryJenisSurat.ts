import axios from "axios";
import { useMyQuery } from "../useMyQuery";

const useQueryJenisSurat = () =>
  useMyQuery("fetchJenisSurat", async () => {
    const { data } = await axios.get("/api/v1/jenisSurat");

    return data;
  });

export default useQueryJenisSurat;
