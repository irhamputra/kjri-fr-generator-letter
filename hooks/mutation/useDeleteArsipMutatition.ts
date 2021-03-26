import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

const useDeleteArsipMutatition = () => {
  const queryClient = useQueryClient();

  return useMutation(
    "deleteArsip",
    async (arsipId: string) => {
      const { data } = await axios.delete(`/api/v1/arsip/${arsipId}`);

      return data;
    },
    {
      onSuccess: async (data) => {
        await queryClient.invalidateQueries("fetchArsip");
        toast.success(data.message);
      },
    }
  );
};

export default useDeleteArsipMutatition;
