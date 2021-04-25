import axios from "axios";
import { useMyQuery } from "../useMyQuery";

const useQueryUsers = () =>
  useMyQuery("fetchUser", async () => {
    const { data } = await axios.get("/api/v1/users");

    return data;
  });

export default useQueryUsers;
