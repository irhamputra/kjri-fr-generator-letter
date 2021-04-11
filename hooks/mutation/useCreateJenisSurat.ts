import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

const useCreateJenisSurat = () => {
  const queryClient = useQueryClient();

  return useMutation(
    "createJenisSurat",
    async () => {
      const { data } = await axios.post("/api/v1/jenisSurat");

      return data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("fetchJenisSurat");
      },
    }
  );
};

export default useCreateJenisSurat;
