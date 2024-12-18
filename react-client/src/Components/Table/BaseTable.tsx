import React, {JSX} from 'react';
import {Table} from "react-bootstrap";

interface IBaseTableProps {
  title?: string,
  variant?: string,
  headerRow: string[],
  bodyRow: JSX.Element
}

function BaseTable({headerRow, bodyRow, variant, title}: IBaseTableProps) {
  return (
    <>
      <h1>{title}</h1>
      <Table variant={variant}>
        <thead>
        <tr>
          {headerRow.map((el, idx) =>
            <th key={idx}>{el}</th>)}
        </tr>
        </thead>
        {bodyRow}
      </Table>
    </>
  );
}

export default BaseTable;