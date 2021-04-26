import axios from "axios";
import parseCookies from "../../utils/parseCookies";
import { useMyQuery } from "../useMyQuery";

const useQueryUser = () =>
  useMyQuery("fetchUser", async () => {
    const cookie = parseCookies();
    const idToken = cookie["KJRIFR-U"];
    const { data } = await axios.get("/api/v1/user", {
      headers: {
        authorization: `Bearer ${idToken}`,
      },
    });

    return data;
  });

export default useQueryUser;
