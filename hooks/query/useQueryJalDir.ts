import { useQuery } from "react-query";
import axios from "axios";

const useQueryJalDis = (key?: boolean | Record<string, string> | string) =>
  useQuery(["fetchJalDis", key], async () => {
    const { data } = await axios.get("/api/v1/jaldir");

    return data;
  });

export default useQueryJalDis;
