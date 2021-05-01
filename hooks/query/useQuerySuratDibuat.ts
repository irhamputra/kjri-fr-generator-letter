import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { Auth } from "../../typings/AuthQueryClient";

const useQuerySuratDibuat = () => {
  const queryClient = useQueryClient();
  const query = queryClient.getQueryData<Auth>("auth");

  return useQuery("fetchSuratDibuat", async () => {
    try {
      const { data } = await axios.get(`/api/v1/surat-dibuat/${query?.email}`);

      return data;
    } catch (e) {
      throw new Error(e.message);
    }
  });
};

export default useQuerySuratDibuat;
