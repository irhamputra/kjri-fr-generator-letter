import { useQuery } from "react-query";
import axios from "axios";

const useQueryJalDir = (key?: boolean | Record<string, string> | string) =>
  useQuery(["fetchJalDir", key], async () => {
    const { data } = await axios.get("/api/v1/jaldir");

    return data;
  });

export default useQueryJalDir;
