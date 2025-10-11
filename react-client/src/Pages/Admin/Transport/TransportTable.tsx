import React, {memo, useMemo} from 'react';
import BaseTable, {IBaseTableProps} from "../../../Components/Table/BaseTable";
import {Column} from "../../../Components/Table/types";
import {Button, InputGroup} from "react-bootstrap";
import {Transport} from "./TransportPage";
import {createColumn, createColumnAction} from "../../../helpers/createColumn";

interface TransportTableProps<T> extends IBaseTableProps<T> {
  handleEdit: (transport: T) => void
  handleDelete: () => void
  handleCheck: (id: number) => void,
  checked?: Set<number>,
}

export function TransportTable<T extends Transport>({
                                                      data,
                                                      checked,
                                                      addElement,
                                                      handleDelete,
                                                      handleEdit,
                                                      handleCheck,
                                                      variant,
                                                      title,
                                                      role
                                                    }: TransportTableProps<T>) {
  const memoTransportColumns = useMemo<Column<T>[]>(() => {
    const transportColumns: Column<T>[] = [
      createColumn('ID', 'id'),
      createColumn('Name', 'name'),
      createColumn('Capacity', 'capacity'),
      createColumnAction('Active', (row: T) => <p
        className={row.isActive ? 'text-success' : 'text-danger'}>{row.isActive ? 'active' : 'inactive'}</p>),
    ]
    if (role === true) {
      transportColumns!.push(
        createColumnAction('Edit', (row) =>
          <Button className="btn-warning"
                  onClick={() => handleEdit(row)}>Edit
          </Button>),
        createColumnAction('Delete', (row) =>
          <InputGroup>
            <InputGroup.Checkbox
              onChange={() => handleCheck(row.id)}
              type="checkbox"
              id={`transport_${row.id}`}
              checked={checked?.has(row.id)}
            />
          </InputGroup>),
      )
    }
    return transportColumns
  }, [role, checked, handleEdit, handleCheck])
  return (
    <>
      {checked!.size > 0 && <Button className="btn-danger float-end" onClick={handleDelete}>Delete</Button>}
      <BaseTable<T> data={data} title={title} addElement={addElement} variant={variant}
                    columns={memoTransportColumns} />
    </>
  );
}

const MemoTransportTable = memo(TransportTable) as <T>(props: TransportTableProps<T>) => JSX.Element
export default MemoTransportTable
