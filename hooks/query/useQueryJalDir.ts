import { useQuery, useQueryClient } from "react-query";
import axios from "axios";

const useQueryJalDis = () => {
  return useQuery(["fetchJalDis"], async () => {
    const { data } = await axios.get("/api/v1/jaldir");

    return data;
  });
};

export default useQueryJalDis;
