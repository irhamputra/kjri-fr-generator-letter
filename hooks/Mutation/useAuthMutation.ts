import { useMutation } from "react-query";
import axios from "axios";
import cookie from "js-cookie";

import type { AuthResponse } from "../../typings/AuthResponse";
import type { InitialValues } from "../../typings/InitialValues";

const useAuthMutation = (type: "login" | "register") => {
  const mutationKey = type === "login" ? "loginUser" : "registerUser";

  return useMutation(
    [mutationKey],
    async (formik: InitialValues): Promise<AuthResponse> => {
      try {
        const { data } = await axios.post(`/api/v1/${type}`, {
          email: formik.email,
          password: formik.password,
          ...(type === "register"
            ? {
                displayName: formik.displayName,
                nip: formik.nip,
              }
            : {}),
        });
        return data;
      } catch (e) {
        throw new Error(e);
      }
    },
    {
      onSuccess: async ({ idToken, refreshToken }) => {
        cookie.set("KJRIFR-U", JSON.stringify({ idToken, refreshToken }));
      },
    }
  );
};

export default useAuthMutation;
