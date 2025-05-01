import React, {JSX, memo, useCallback, useMemo} from 'react';
import BaseTable, {IBaseTableProps} from "../../../Components/Table/BaseTable";
import {Button, InputGroup} from "react-bootstrap";
import {Column} from "../../../Components/Table/types";
import {SelectedUsersRowType} from "./Company";

export interface InteractWithTablePros<T> extends IBaseTableProps<T> {
  handleEdit: (row: T) => void,
  handleCheck: (id: number) => void
  handleShowUsers?: (users: SelectedUsersRowType[]) => void
  checked?: Set<number>
}

function CompanyTable<T extends {id: number, name: string, users: SelectedUsersRowType[]}>({data, checked, role, title, variant, addElement, handleShowUsers, handleCheck, handleEdit}: InteractWithTablePros<T>) {
  const handleUserClick = useCallback((users: SelectedUsersRowType[]) => {
    if(handleShowUsers !== undefined) {
      handleShowUsers(users)
    }
  }, [handleShowUsers])
  const handleEditClick = useCallback((row: any) => {
    handleEdit(row)
  }, [handleEdit])
  const handleCheckChange = useCallback((id: number) => {
    handleCheck(id)
  }, [handleCheck])
  const companyColumns = useMemo<Column<T>[]>(() => {
    const companyColumns: Column<T>[] = [
      {header: '#', accessor: 'id'},
      {header: 'Company', accessor: 'name'},
      {header: 'Users of company', accessor: (row) => <Button onClick={() => handleUserClick(row.users)}>users</Button>},
    ]
    if (role) {
      companyColumns!.push(
        {header: 'Edit', accessor: (row) => <Button className="btn btn-warning" onClick={() => handleEditClick(row)}>edit</Button>},
        {header: 'Delete', accessor: (row) => <InputGroup>
            <InputGroup.Checkbox
              onChange={() => handleCheckChange((row as T).id)}
              type="checkbox"
              id={`cmp_${row.id}`}
              checked={checked?.has(row.id)}
            />
          </InputGroup>
        }
      )
    }
        return companyColumns
  }, [checked, handleCheckChange, handleEditClick, handleUserClick, role])
  return (
    <BaseTable<T>
      title={title}
      addElement={addElement}
      columns={companyColumns}
      variant={variant}
      data={data}
    />
  );
}

const MemoCompanyTable = memo(CompanyTable) as <T extends { id: number; name: string; users: SelectedUsersRowType[] }>(props: InteractWithTablePros<T>) => JSX.Element
export default MemoCompanyTable
