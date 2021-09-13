import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

const useCreateJenisSurat = <T>() => {
  const queryClient = useQueryClient();

  return useMutation(
    "createJenisSurat",
    async (val: T) => {
      const { data } = await axios.post("/api/v1/jenisSurat", val);

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
