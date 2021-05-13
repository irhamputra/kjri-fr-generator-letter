import { useMutation } from "react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

const useVerifyAccount = <T>() => {
  const { replace } = useRouter();

  return useMutation(
    "accountVerification",
    async (values: T) => {
      try {
        const { data } = await axios.post("/api/v1/verify-user", values);

        return data;
      } catch (e) {
        throw new Error("Tidak ada user ditemukan");
      }
    },
    {
      onSuccess: async (data) => {
        toast(data.message);
        await replace({ pathname: "/create-new-account", query: { codeId: data.identityNumber } });
      },
      onError: () => {
        toast.error("Kode atau Tanggal lahir salah tidak ditemukan");
      },
    }
  );
};

export default useVerifyAccount;
