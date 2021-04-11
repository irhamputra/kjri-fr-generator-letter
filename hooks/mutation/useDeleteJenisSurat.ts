import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

const useDeleteJenisSurat = () => {
  const queryClient = useQueryClient();

  return useMutation(
    "deleteJenisSurat",
    async (id: string) => {
      const { data } = await axios.delete(`/api/v1/jenisSurat/${id}`);

      return data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("fetchJenisSurat");
      },
    }
  );
};

export default useDeleteJenisSurat;
