import { QueryFunction, QueryKey, useQuery, UseQueryOptions, UseQueryResult } from "react-query";

export const useMyQuery = <TQueryFnData = unknown, TError = unknown, TData = TQueryFnData>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TQueryFnData>,
  option?: UseQueryOptions<TQueryFnData, TError, TData>
): UseQueryResult<TData, TError> => {
  const query = useQuery(queryKey, queryFn, {
    staleTime: 60 * 60 * 10,
    ...option,
  });
  return query;
};
