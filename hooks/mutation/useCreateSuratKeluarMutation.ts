import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import useQueryJenisSurat from "../query/useQueryJenisSurat";
import { useQuerySuratKeluarStats } from "../query/useQuerySuratKeluar";

export interface UseSuratKeluarProps {
  author: string;
  arsipId: string;
  id: string;
  jenisSurat: string;
}

export interface UseSuratKeluarOnMutate extends UseSuratKeluarProps {
  nomorSurat: string;
}

const useCreateSuratKeluarMutation = ({
  onMutate = async (val) => val,
  onError = (val) => val,
  onSuccess = (val) => val,
}: {
  onMutate?: (val: UseSuratKeluarOnMutate) => Promise<any>;
  onError?: (val: any) => Promise<any>;
  onSuccess?: (val: any) => Promise<any>;
}) => {
  const queryClient = useQueryClient();
  const { data: listJenisSurat } = useQueryJenisSurat();
  const { data: stats } = useQuerySuratKeluarStats();

  return useMutation(
    "createSuratKeluar",
    async (values: UseSuratKeluarProps) => {
      const { arsipId, ...restValues } = values;
      const labelJenisSurat = listJenisSurat?.find((v: { label: string }) => v.label === restValues.jenisSurat).label;
      const { data: statsNew } = await axios.get("/api/v1/surat-keluar/stats");

      const nomorSurat = createNomorSurat(statsNew.counter, arsipId, labelJenisSurat);

      const { data } = await axios.post("/api/v1/surat-keluar", { nomorSurat, ...restValues });

      return data;
    },
    {
      onMutate: async (data) => {
        const { arsipId, ...restValues } = data;
        const labelJenisSurat = listJenisSurat?.find((v: { label: string }) => v.label === restValues.jenisSurat).label;
        const nomorSurat = createNomorSurat(stats.counter, arsipId, labelJenisSurat);

        onMutate({ arsipId, nomorSurat, ...restValues });

        const previousTodos = queryClient.getQueryData("createSuratKeluar");

        return { previousTodos };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (err, newTodo, context: any) => {
        onError(context);
        queryClient.setQueryData("fetchSuratKeluar", context.previousTodos);
      },

      onSuccess: async (data) => {
        onSuccess(data);
        toast.success(data.message);
      },
    }
  );
};

const createNomorSurat = (counter: number, arsipId: string, labelJenisSurat: string) => {
  const incrementNumber = `00${counter + 1}`;
  const thisMonth = dayjs().month() + 1;
  const thisYear = dayjs().year();

  let jenisSurat = "";
  let suffixFRA = false;
  let suratKeputusan = "";

  if (labelJenisSurat === "Surat Pengumuman") {
    jenisSurat = "PEN";
  }

  if (labelJenisSurat === "Surat Keterangan") {
    jenisSurat = "SUKET";
  }

  if (!["Nota Dinas", "Surat Edaran", "Surat Keputusan"].includes(labelJenisSurat)) {
    suffixFRA = true;
  }

  if (labelJenisSurat === "Surat Keputusan") {
    suratKeputusan = "SK-FRA";
  }

  const nomorSurat = `${incrementNumber}/${suratKeputusan ? `${suratKeputusan}/` : ""}${
    jenisSurat ? `${jenisSurat}/` : ""
  }${arsipId}/${thisMonth}/${thisYear}${suffixFRA ? "/FRA" : ""}`;

  return nomorSurat;
};

export default useCreateSuratKeluarMutation;
