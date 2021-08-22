import axios from "axios";
import { Pegawai } from "../../typings/Pegawai";
import { useMyQuery } from "../useMyQuery";

const useQueryUsers = () =>
  useMyQuery<Pegawai[]>("fetchUser", async () => {
    const { data } = await axios.get("/api/v1/users");

    return data;
  });

export default useQueryUsers;
