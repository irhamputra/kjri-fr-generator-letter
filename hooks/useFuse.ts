import * as React from "react";
import Fuse from "fuse.js";

const useFuse = <TData extends readonly unknown[], TOptions extends { loading: boolean }>(
  data: TData,
  options: TOptions
) => {
  const [searchQuery, setSearch] = React.useState("");
  const [filteredList, setFilteredList] = React.useState<Array<Record<string, string>> | unknown>([]);
  const { loading, ...rest } = options;

  const search = (query: string) => {
    const fuse = new Fuse(data, rest);

    const res = fuse.search(query);
    setFilteredList(res);
  };

  React.useEffect(() => {
    data && searchQuery.length > 1 && search(searchQuery);
  }, [searchQuery, loading]);

  return { searchQuery, setSearch, filteredList };
};

export default useFuse;
