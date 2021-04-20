import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { Auth } from "../../typings/AuthQueryClient";

const useQuerySuratPerjalanan = () => {
  const queryClient = useQueryClient();
  const query = queryClient.getQueryData<Auth>("auth");

  return useQuery("fetchSuratPerjalanan", async () => {
    const { data } = await axios.get(`/api/v1/surat-perjalanan/${query.email}`);

    return data;
  });
};

export default useQuerySuratPerjalanan;
