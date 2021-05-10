import axios from "axios";
import apiInstance from "../../utils/firebase/apiInstance";
import parseCookies from "../../utils/parseCookies";
import { useMyQuery } from "../useMyQuery";

const useQueryAuth = () => {
  return useMyQuery(
    "auth",
    async () => {
      const cookie = parseCookies();

      const idToken = cookie["KJRIFR-U"];
      const { data } = await apiInstance.get("/api/v1/user", {
        headers: {
          authorization: `Bearer ${idToken}`,
        },
      });

      return data;
    },
    {
      cacheTime: Infinity,
    }
  );
};

export default useQueryAuth;
