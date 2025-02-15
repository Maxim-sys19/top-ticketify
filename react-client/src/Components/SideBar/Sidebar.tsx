import React from 'react';
import './sidebar.scss'
import {NavLink} from "react-router-dom";
import {ListGroup} from "react-bootstrap";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ListGroup as={'ul'} style={{width: '100%'}}>
        <NavLink to="/dashboard" className="list-group-item list-group-item-secondary" >dashboard</NavLink>
        <NavLink to="/company" className="list-group-item list-group-item-secondary">company</NavLink>
        <NavLink to="/transport" className="list-group-item list-group-item-secondary">transport</NavLink>
        <NavLink to="/routes" className="list-group-item list-group-item-secondary">routes</NavLink>
      </ListGroup>
    </div>
  )
}

export default Sidebar;