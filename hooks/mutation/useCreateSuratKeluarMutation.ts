import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

const useCreateSuratKeluarMutation = <T>() => {
  const queryClient = useQueryClient();

  return useMutation(
    "createSuratKeluar",
    async (values: T) => {
      const { data } = await axios.post("/api/v1/surat-keluar", values);

      return data;
    },
    {
      onSuccess: async (data) => {
        await queryClient.invalidateQueries("fetchSuratKeluar");

        toast.success(data.message);
      },
    }
  );
};

export default useCreateSuratKeluarMutation;
