import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

const useDeleteSPDMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    "deleteSPD",
    async (spdId: string) => {
      const { data } = await axios.delete(`/api/v1/surat-tugas/${spdId}`);

      return data;
    },
    {
      onSuccess: async (data) => {
        await queryClient.invalidateQueries("fetchSuratTugas");
        toast.success(data.message);
      },
    }
  );
};

export default useDeleteSPDMutation;
