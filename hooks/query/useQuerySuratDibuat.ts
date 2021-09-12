import { useQueryClient } from "react-query";
import axios from "axios";
import { Auth } from "../../typings/AuthQueryClient";
import { useMyQuery } from "../useMyQuery";

const useQuerySuratDibuat = () => {
  const queryClient = useQueryClient();
  const query = queryClient.getQueryData<Auth>("auth");

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  return useMyQuery(
    "fetchSuratDibuat",
    async () => {
      try {
        const { data } = await axios.get(`/api/v1/surat-dibuat/${query?.email}`, { cancelToken: source.token });

        return data;
      } catch (e) {
        source.cancel("Cancel");
      }
    },
    { onError: (err) => queryClient.cancelQueries() }
  );
};

export default useQuerySuratDibuat;
