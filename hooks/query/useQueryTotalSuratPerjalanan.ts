import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { Auth } from "../../typings/AuthQueryClient";

const useQueryTotalSuratPerjalanan = () => {
  const queryClient = useQueryClient();
  const query = queryClient.getQueryData<Auth>("auth");

  return useQuery("fetchSuratPerjalanan", async () => {
    const { data } = await axios.get(`/api/v1/surat-perjalanan/${query.email}`);

    return data.length;
  });
};

export default useQueryTotalSuratPerjalanan;
