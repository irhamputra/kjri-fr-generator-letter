import { useQuery } from "react-query";
import axios from "axios";

const useQueryJenisSurat = () =>
  useQuery("fetchJenisSurat", async () => {
    const { data } = await axios.get("/api/v1/jenisSurat");

    return data;
  });

export default useQueryJenisSurat;
