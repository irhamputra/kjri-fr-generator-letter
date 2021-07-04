import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

const useUpdateSuratKeluarMutation = <T>() => {
  const queryClient = useQueryClient();

  return useMutation(
    "updateSuratKeluar",
    async (values: T) => {
      const { data } = await axios.put("/api/v1/surat-keluar", values);

      return data;
    },
    {
      onSuccess: async (data) => {
        await queryClient.invalidateQueries("fetchSuratKeluar");
        await queryClient.invalidateQueries("fetchSuratDibuat");
        // toast.success(data.message);
      },
    }
  );
};

export default useUpdateSuratKeluarMutation;
