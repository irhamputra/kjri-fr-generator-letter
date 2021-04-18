import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

const useDeleteSuratKeluar = () => {
  const queryClient = useQueryClient();

  return useMutation(
    "deleteSuratKeluar",
    async (id: string) => {
      const { data } = await axios.delete(`/api/v1/surat-keluar/${id}`);

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

export default useDeleteSuratKeluar;
