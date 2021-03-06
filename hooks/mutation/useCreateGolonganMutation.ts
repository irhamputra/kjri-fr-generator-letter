import { useMutation, useQueryClient } from "react-query";
import axios, { AxiosResponse } from "axios";
import { toast } from "react-hot-toast";

const useCreateGolonganMutation = <T>() => {
  const queryClient = useQueryClient();

  return useMutation(
    "createGolongan",
    async (values: T) => {
      let response: AxiosResponse;

      try {
        response = await axios.post("/api/v1/jaldir", values);

        toast.success(response.data.message);
      } catch (e) {
        toast.error("Terjadi kesalahan teknis! Mohon ulangi kembali");
        throw new Error(e.message);
      }
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("fetchJalDis");
      },
    }
  );
};

export default useCreateGolonganMutation;
