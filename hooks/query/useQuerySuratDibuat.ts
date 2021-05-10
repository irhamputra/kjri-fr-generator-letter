import { useQueryClient } from "react-query";
import axios from "axios";
import { Auth } from "../../typings/AuthQueryClient";
import { useMyQuery } from "../useMyQuery";
const useQuerySuratDibuat = () => {
  const queryClient = useQueryClient();
  const query = queryClient.getQueryData<Auth>("auth");

  return useMyQuery("fetchSuratDibuat", async () => {
    try {
      const { data } = await axios.get(`/api/v1/surat-dibuat/${query?.email}`);

      return data;
    } catch (e) {
      throw new Error(e.message);
    }
  });
};

export default useQuerySuratDibuat;
