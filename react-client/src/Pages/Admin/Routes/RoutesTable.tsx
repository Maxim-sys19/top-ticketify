import React, {memo, useMemo} from 'react';
import BaseTable from "../../../Components/Table/BaseTable";
import {Column} from "../../../Components/Table/types";
import {Route} from "./RoutesPage";
import {Button, InputGroup} from "react-bootstrap";
import {InteractWithTablePros} from '../Companies/CompanyTable';

function RoutesTable<T extends Route>({title, checked, addElement, handleCheck, handleEdit, data, role, variant}: InteractWithTablePros<T>) {
  const routeColumns = useMemo<Column<T>[]>(() => {
    const routeColumns: Column<T>[] = [
      {header: 'ID', accessor: 'id'},
      {header: 'start', accessor: 'start'},
      {header: 'end', accessor: 'end'},
      {header: 'departure time', accessor: 'departureTime'},
      {header: 'arrival time', accessor: 'arrivalTime'},
      {header: 'route code', accessor: 'routeCode'},
    ]
    if(role) {
      routeColumns.push(
        {header: 'Edit', accessor: (row) => <Button className="btn btn-warning" onClick={() => handleEdit(row)}>Edit</Button>},
        {header: 'Delete', accessor: (row) => <InputGroup>
            <InputGroup.Checkbox
              onChange={() => handleCheck(row.id)}
              type="checkbox"
              checked={checked?.has(row.id)}
            />
        </InputGroup>,},
      )
    }
    return routeColumns
  }, [role, checked, handleCheck])
  return (
    <BaseTable<T> title={title} data={data} addElement={addElement} variant={variant} columns={routeColumns}/>
  );
}

const memoRouteTable = memo(RoutesTable) as <T extends Route>(props: InteractWithTablePros<T>) => JSX.Element;
export default memoRouteTable;