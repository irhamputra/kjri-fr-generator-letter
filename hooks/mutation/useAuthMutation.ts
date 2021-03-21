import { useMutation } from "react-query";
import axios from "axios";
import cookie from "js-cookie";

const useAuthMutation = <T>(type: "login" | "register") => {
  const mutationKey = type === "login" ? "loginUser" : "registerUser";

  return useMutation(
    [mutationKey],
    async (formik: T) => {
      try {
        const { data } = await axios.post(`/api/v1/${type}`, formik);
        return data;
      } catch (e) {
        throw new Error(e.response.data.message);
      }
    },
    {
      onSuccess: async ({ idToken, refreshToken }) => {
        if (type === "login") {
          cookie.set("KJRIFR-U", idToken, {
            expires: 2 / 48,
          });
          cookie.set("rtfa", refreshToken);
        }
      },
    }
  );
};

export default useAuthMutation;
