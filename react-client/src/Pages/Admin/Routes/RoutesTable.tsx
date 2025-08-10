import React, {memo, useMemo} from 'react';
import BaseTable from "../../../Components/Table/BaseTable";
import {Column} from "../../../Components/Table/types";
import {Route} from "./RoutesPage";
import {Dropdown, InputGroup} from "react-bootstrap";
import {InteractWithTablePros} from '../Companies/CompanyTable';
import RouteDropDown from '../../../Components/DropDown/BaseDropDown'

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
    if (role) {
      routeColumns.push(
        {
          header: 'Action',
          accessor: (row) =>
            <RouteDropDown title="action">
              <Dropdown.Item onClick={() => handleEdit(row)}>Edit</Dropdown.Item>
            </RouteDropDown>
        },
        {
          header: 'Delete', accessor: (row: T) => <InputGroup>
            <InputGroup.Checkbox
              onChange={() => handleCheck(row.id)}
              type="checkbox"
              checked={checked?.has(row.id)}
            />
          </InputGroup>,
        },
      )
    }
    return routeColumns
  }, [role, handleEdit, checked, handleCheck])
  return (
    <BaseTable<T> title={title} data={data} addElement={addElement} variant={variant} columns={routeColumns} />
  );
}

const memoRouteTable = memo(RoutesTable) as <T extends Route>(props: InteractWithTablePros<T>) => JSX.Element;
export default memoRouteTable;