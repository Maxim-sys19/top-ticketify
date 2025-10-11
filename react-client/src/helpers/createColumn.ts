import {Column} from "../Components/Table/types";
import {getNestedValue} from "./getNestedValue";
import React from "react";

const createColumn = <T extends object>(header: string, accessor: keyof T | string): Column<T> => {
  if (typeof accessor === 'string' && accessor.includes('.')) {
    return {
      header,
      accessor,
      cell: (row: T) => getNestedValue(row, accessor)
    }
  }
  return {header, accessor}
}

const createColumnAction = <T extends object>(header: string, render: (row: T) => React.ReactNode): Column<T> => ({
  header, cell: render
})
export {createColumnAction, createColumn}