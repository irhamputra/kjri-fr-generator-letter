import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { Auth } from "../typings/AuthQueryClient";
import { downloadURI } from "../utils/download";
import { toast } from "react-hot-toast";

const useDownloadSuratTugas = () => {
  return useMutation(
    "downloadSuratTugas",
    async (suratTugasId: string) => {
      const { data } = await axios.post(`/api/v1/print/surat-tugas`, { id: suratTugasId });
      return data;
    },
    {
      onSuccess: async ({ message, url }) => {
        downloadURI(url);
        toast(message);
      },
    }
  );
};

const useDownloadSuratPenugasan = () => {
  const queryClient = useQueryClient();
  const query = queryClient.getQueryData<Auth>("auth");

  return useMutation(
    "downloadSuratTugas",
    async (suratTugasId: string) => {
      const { data } = await axios.post("/api/v1/print/penugasan", { suratTugasId, email: query?.email });
      return data;
    },
    {
      onSuccess: async ({ message, url }) => {
        downloadURI(url);
        toast(message);
      },
    }
  );
};

export { useDownloadSuratTugas, useDownloadSuratPenugasan };
