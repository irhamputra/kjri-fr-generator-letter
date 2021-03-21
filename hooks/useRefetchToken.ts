import { useQuery } from "react-query";
import axios from "axios";
import cookie from "js-cookie";

const useRefetchToken = () =>
  useQuery(
    "refetchToken",
    async () => {
      const refreshToken = cookie.get("rtfa");
      const { data } = await axios.post("/api/v1/user", { refreshToken });

      return data;
    },
    {
      enabled: !!cookie.get("KJRIFR-U"),
      refetchOnWindowFocus: false,
      staleTime: 1800000,
      cacheTime: 1800000,
      onSuccess: ({ id_token, refresh_token }) => {
        cookie.set("KJRIFR-U", id_token, { expires: 2 / 48 });
        cookie.set("rtfa", refresh_token);
      },
    }
  );

export default useRefetchToken;
