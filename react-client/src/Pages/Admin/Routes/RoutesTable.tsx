import React, {memo, useMemo} from 'react';
import BaseTable from "../../../Components/Table/BaseTable";
import {Column} from "../../../Components/Table/types";
import {Route} from "./RoutesPage";
import {Dropdown, InputGroup} from "react-bootstrap";
import {InteractWithTablePros} from '../Companies/CompanyTable';
import RouteDropDown from '../../../Components/DropDown/BaseDropDown'
import {createColumn, createColumnAction} from "../../../helpers/createColumn";

function RoutesTable<T extends Route>({
                                        title,
                                        checked,
                                        addElement,
                                        handleCheck,
                                        handleEdit,
                                        data,
                                        role,
                                        variant
                                      }: InteractWithTablePros<T>) {
  console.log(data)
  const routeColumns = useMemo<Column<T>[]>(() => {
    const routeColumns: Column<T>[] = [
      createColumn('ID', 'id'),
      createColumn('start address', 'start_address'),
      createColumn('end address', 'end_address'),
      createColumn('distance', 'distance_meters.text'),
      createColumn('duration', 'duration_seconds.text'),
      createColumn('departure time', 'departureTime'),
      createColumn('arrival time', 'arrivalTime'),
      createColumn('route code', 'routeCode'),
    ]
    if (role) {
      routeColumns.push(
        createColumnAction('Action', (row) =>
          <RouteDropDown title="action">
            <Dropdown.Item onClick={() => handleEdit(row)}>Edit</Dropdown.Item>
          </RouteDropDown>),
        createColumnAction('Delete', (row: T) =>
          <InputGroup>
            <InputGroup.Checkbox
              onChange={() => handleCheck(row.id)}
              type="checkbox"
              checked={checked?.has(row.id)}
            />
          </InputGroup>)
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