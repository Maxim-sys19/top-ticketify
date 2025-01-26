import React, {JSX, memo, useMemo} from 'react';
import BaseTable, {IBaseTableProps} from "../../../Components/Table/BaseTable";
import {Button, InputGroup} from "react-bootstrap";
import {Column} from "../../../Components/Table/types";
import {SelectedUsersRowType} from "./Company";

interface CompanyTableProps<T> extends IBaseTableProps<T> {
  handleEdit: (row: T) => void,
  handleCheck: (id: number) => void
  handleShowUsers: (users: SelectedUsersRowType[]) => void
  checked?: number[]
}

function CompanyTable<T extends {id: number, name: string, users: SelectedUsersRowType[]}>({data, checked, role, title, variant, addElement, handleShowUsers, handleCheck, handleEdit}: CompanyTableProps<T>) {
  // console.log('Company Table')
  const companyColumns = useMemo<Column<T>[]>(() => {
    const companyColumns: Column<T>[] = [
      {header: '#', accessor: 'id'},
      {header: 'Company', accessor: 'name'},
      {header: 'Users of company', accessor: (row) => <Button onClick={() => handleShowUsers(row.users)}>users</Button>},
    ]
    if (role) {
      companyColumns!.push(
        {header: 'Edit', accessor: (row) => <Button className="btn btn-warning" onClick={() => handleEdit(row)}>edit</Button>},
        {header: 'Delete', accessor: (row) => <InputGroup>
            <InputGroup.Checkbox
              onChange={() => handleCheck((row as T).id)}
              type="checkbox"
              id={`cmp_${row.id}`}
              checked={checked?.includes(row.id)}
            />
          </InputGroup>
        }
      )
    }
        return companyColumns
  }, [checked, handleCheck, handleEdit, handleShowUsers, role])
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

const MemoCompanyTable = memo(CompanyTable) as <T>(props: CompanyTableProps<T>) => JSX.Element
export default MemoCompanyTable
