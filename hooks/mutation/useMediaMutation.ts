import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useMyQuery } from "../useMyQuery";

const useUpdateBackground = <T>() => {
    const queryClient = useQueryClient();

    return useMutation(
        "updateBackground",
        async (values: T) => {
            const { data } = await axios.put("/api/v1/media/background", values);

            return data;
        },
        {
            onSuccess: async (data) => {
                await queryClient.invalidateQueries("updateBackground");
                await queryClient.invalidateQueries("background");

                toast.success(data.message);
            },
        }
    );
};

const useFetchBackground = <T>() => {

    return useMyQuery(
        "background",
        async () => {
            const { data } = await axios.get("/api/v1/media/background");
            return data;
        }
    );
};

export { useUpdateBackground, useFetchBackground };
