import { useMutation } from "react-query";
import axios from "axios";
import { saveAs } from "file-saver";
import { toast } from "react-hot-toast";
import { useState } from "react";

const useDownloadSuratTugas = () => {
  return useMutation(
    "downloadSuratTugas",
    async (suratTugasId: string) => {
      const { data } = await axios.post(`/api/v1/print/surat-tugas`, { id: suratTugasId });
      return { ...data, suratTugasId };
    },
    {
      onSuccess: async ({ message, url, suratTugasId }) => {
        saveAs(url, `Surat-Tugas-${suratTugasId}.docx`); // name not work??
        toast(message);
      },
    }
  );
};

const useDownloadFile = () => {
  return useMutation(
    "downloadFile",
    async (destination: string) => {
      const { data } = await axios.post(`/api/v1/print`, { destination });
      return { ...data, destination };
    },
    {
      onSuccess: async ({ message, url, destination }) => {
        saveAs(url, destination); // name not work??
        toast(message);
      },
    }
  );
};

const useDownloadSuratPenugasan = () => {
  const [downloadUid, setDownloadUid] = useState("");
  const mutation = useMutation(
    "downloadSuratTugas",
    async ({ suratTugasId, uid, forceRecreate }: { suratTugasId: string; uid: string; forceRecreate: boolean }) => {
      setDownloadUid(uid);
      const { data } = await axios.post("/api/v1/print/penugasan", { suratTugasId, uid, forceRecreate });
      return data;
    },
    {
      onSuccess: async ({ message, url }) => {
        saveAs(url);
        setDownloadUid("");
        toast(message);
      },
    }
  );
  return { downloadUid, ...mutation };
};

export { useDownloadSuratTugas, useDownloadSuratPenugasan, useDownloadFile };
