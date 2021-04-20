import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { saveAs } from "file-saver";
import { Auth } from "../typings/AuthQueryClient";

const usePrintFile = () => {
  const queryClient = useQueryClient();
  const query = queryClient.getQueryData<Auth>("auth");

  return useMutation(
    "printData",
    async (id: string) => {
      const { data } = await axios.get(`/api/v1/print/${id}`, {
        responseType: "arraybuffer",
      });

      return data;
    },
    {
      onSuccess: async (data) => {
        const blob = new Blob([data], { type: "application/pdf;charset=utf-8" });
        saveAs(blob, `surat-perjalanan-${query?.displayName}.pdf`);
      },
    }
  );
};

export default usePrintFile;
