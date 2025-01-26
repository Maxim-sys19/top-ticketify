import React, {memo, useMemo} from 'react';
import BaseTable, {IBaseTableProps} from "../../../Components/Table/BaseTable";
import {Column} from "../../../Components/Table/types";
import {Button, InputGroup} from "react-bootstrap";
import {Transport} from "./TransportPage";

interface TransportTableProps<T> extends IBaseTableProps<T> {
  handleEdit: (transport: T) => void
  handleDelete: () => void
  handleCheck: (id: number) => void,
  checked?: number[],
}

export function TransportTable<T extends Transport>({data, checked, addElement, handleDelete, handleEdit, handleCheck, variant, title, role}: TransportTableProps<T>) {
  const memoTransportColumns = useMemo<Column<T>[]>(() => {
    const transportColumns: Column<T>[] = [
      {header: '#', accessor: 'id'},
      {header: 'Transport name', accessor: 'name'},
      {header: 'Capacity', accessor: 'capacity'},
      {header: 'Active',
        accessor: (row: T) => <p className={row.isActive ? 'text-success' : 'text-danger'}>{row.isActive ? 'active' : 'inactive'}</p>
      },
    ]
    if (role === true) {
      transportColumns!.push(
        {header: 'Edit', accessor: (row) => <Button className="btn-warning" onClick={() => handleEdit(row)}>Edit</Button>},
        {header: 'Delete', accessor: (row) => <InputGroup>
            <InputGroup.Checkbox
              onChange={() => handleCheck(row.id)}
              type="checkbox"
              id={`transport_${row.id}`}
              checked={checked?.includes(row.id)}
            />
          </InputGroup>}
      )
    }
    return transportColumns
  }, [role, checked, handleEdit, handleCheck])
  return (
    <>
      {checked!.length > 0 && <Button className="btn-danger float-end" onClick={handleDelete}>Delete</Button>}
      <BaseTable<T> data={data} title={title} addElement={addElement} variant={variant} columns={memoTransportColumns} />
    </>
);
}
const MemoTransportTable = memo(TransportTable) as <T>(props: TransportTableProps<T>) => JSX.Element
export default MemoTransportTable
