import axios from "axios";
import { useMyQuery } from "../useMyQuery";

const useQueryJalDis = () => {
  return useMyQuery(["fetchJalDis"], async () => {
    const { data } = await axios.get("/api/v1/jaldir");

    return data;
  });
};

export default useQueryJalDis;
