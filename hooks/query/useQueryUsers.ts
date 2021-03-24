import { useQuery } from "react-query";
import axios from "axios";

const useQueryUsers = () =>
  useQuery("fetchUser", async () => {
    const { data } = await axios.get("/api/v1/users");

    return data;
  });

export default useQueryUsers;
