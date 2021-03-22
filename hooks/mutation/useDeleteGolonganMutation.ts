import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

const useDeleteGolonganMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    "deleteGolongan",
    async (id: string) => {
      try {
        const { data } = await axios.delete(`/api/v1/jaldir/${id}`);
        return data;
      } catch (e) {
        throw new Error(e.message);
      }
    },
    {
      onSuccess: async (data) => {
        await queryClient.invalidateQueries("fetchJalDis");
        toast.success(data.message);
      },
    }
  );
};

export default useDeleteGolonganMutation;
