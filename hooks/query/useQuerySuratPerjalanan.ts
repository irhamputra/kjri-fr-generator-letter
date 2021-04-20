import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { Auth } from "../../typings/AuthQueryClient";

const useQuerySuratPerjalanan = () => {
  const queryClient = useQueryClient();
  const query = queryClient.getQueryData<Auth>("auth");

  return useQuery("fetchSuratPerjalananCount", async () => {
    try {
      const { data } = await axios.get(`/api/v1/surat-perjalanan/${query?.email}`);

      return data;
    } catch (e) {
      throw new Error(e.message);
    }
  });
};

export default useQuerySuratPerjalanan;
