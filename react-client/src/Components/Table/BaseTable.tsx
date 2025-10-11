import React, {JSX, memo} from 'react';
import {Table} from "react-bootstrap";
import {Column, TableConfig} from "./types";

export interface IBaseTableProps<T> extends TableConfig<T> {
  title?: string,
  variant?: string,
  addElement?: (id: number, el: HTMLDivElement | null) => void
}

function BaseTable<T>({variant, title, data, columns, addElement}: IBaseTableProps<T>) {
  return (
    <>
      <h1>{title}</h1>
      <Table variant={variant} size="small">
        <thead>
        <tr>
          {columns?.map((col: Column<T>, index: number) =>
            <th key={index}>{col.header}</th>)}
        </tr>
        </thead>
        <tbody >
        {
          data?.map((row: T, rowIndex) => (
            <tr key={(row as any).id || rowIndex} ref={(e) => addElement ? addElement((row as any).id || rowIndex, e) : null}>
              {columns?.map((col, colIndex) => (
                <td key={colIndex}>
                  {typeof col.cell === 'function'
                    ? col.cell(row)
                    : String(row[col.accessor as keyof T])}
                </td>
              ))}
            </tr>
          ))
        }
        </tbody>
      </Table>
    </>
  );
}

const MemoTable =  memo(BaseTable) as <T>(props: IBaseTableProps<T>) => JSX.Element;
export default MemoTable