import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import toast from "react-hot-toast";
import parseCookies from "../../utils/parseCookies";

const useEditUser = <T>() => {
  const queryClient = useQueryClient();

  return useMutation(
    ["editUser"],
    async (formik: T) => {
      try {
        const cookie = parseCookies();
        const idToken = cookie["KJRIFR-U"];

        const response = await axios.put(`/api/v1/user`, formik, {
          headers: {
            authorization: `Bearer ${idToken}`,
          },
        });
        return response;
      } catch (e) {
        throw new Error(e.message);
      }
    },
    {
      onSuccess: async (response) => {
        await queryClient.invalidateQueries("fetchUser");
        toast.success(response.data.message);
      },
    }
  );
};

export default useEditUser;
