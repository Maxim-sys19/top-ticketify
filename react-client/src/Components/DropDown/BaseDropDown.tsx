import React from 'react';
import {Dropdown} from "react-bootstrap";

interface BaseDropDownProps {
  title: string;
  children: React.ReactNode;
}
const BaseDropDown = ({title, children}: BaseDropDownProps) => {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-dark">{title}</Dropdown.Toggle>
      <Dropdown.Menu variant="dark">
        {children}
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default BaseDropDown;