import { useQueryClient } from "react-query";
import axios from "axios";
import { Auth } from "../../typings/AuthQueryClient";
import { useMyQuery } from "../useMyQuery";

const useQueryTotalSuratPerjalanan = () => {
  const queryClient = useQueryClient();
  const query = queryClient.getQueryData<Auth>("auth");

  return useMyQuery("fetchSuratPerjalanan", async () => {
    const { data } = await axios.get(`/api/v1/surat-perjalanan/${query?.email}`);

    return data.length;
  });
};

export default useQueryTotalSuratPerjalanan;
