import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import toast from "react-hot-toast";
import parseCookies from "../../utils/parseCookies";

const usePrintSuratTugas = <T>() => {

    return useMutation(
        ["editUser"],
        async (docId: string) => {
            try {
                const cookie = parseCookies();
                const idToken = cookie["KJRIFR-U"];

                const response = await axios.get(`/api/v1/print/surat-tugas/${docId}`, {
                    headers: {
                        authorization: `Bearer ${idToken}`,
                    },
                });
                return response;
            } catch (e) {
                throw new Error(e.message);
            }
        },
        {
            onSuccess: async (response) => {
                toast.success("Berhasil membuat dokumen");
            },
        }
    );
};

export { usePrintSuratTugas };
