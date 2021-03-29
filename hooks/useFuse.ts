import * as React from "react";
import Fuse from "fuse.js";

const useFuse = (data, options) => {
  const [searchQuery, setSearch] = React.useState("");
  const [filteredList, setFilteredList] = React.useState([]);
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
