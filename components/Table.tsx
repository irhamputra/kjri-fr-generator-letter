import {
  HeaderGroup,
  useGlobalFilter,
  UseGlobalFiltersInstanceProps,
  useSortBy,
  UseSortByColumnProps,
  useTable,
  TableInstance,
} from "react-table";
import React from "react";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";

type PropsColumn = HeaderGroup<any> & UseSortByColumnProps<any>;
type PropsReturn = TableInstance<any> & UseGlobalFiltersInstanceProps<any>;

function Table<T extends UseGlobalFiltersInstanceProps<T>>({
  columns,
  data,
  search,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable<UseGlobalFiltersInstanceProps<any>>(
    { columns, data },
    useGlobalFilter,
    useSortBy
  ) as PropsReturn;

  return (
    <>
      <div className="w-100">
        {search({ state, preGlobalFilteredRows, setGlobalFilter })}
      </div>
      <table className="table table-striped" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: PropsColumn) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span style={{ marginLeft: 8 }}>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <ChevronDown />
                      ) : (
                        <ChevronUp />
                      )
                    ) : (
                      ""
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default Table;
