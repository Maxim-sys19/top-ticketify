import React, {useContext} from 'react';
import './sidebar.scss'
import {NavLink} from "react-router-dom";
import {ListGroup} from "react-bootstrap";
import {CompanyUserContext} from "../../context/user/UserContext";

const Sidebar = () => {
  const isCompanyUser = useContext(CompanyUserContext)
  return (
    <div className="sidebar">
      <ListGroup as={'ul'} style={{width: '100%'}}>
        <NavLink to="/dashboard" className="list-group-item list-group-item-secondary" >dashboard</NavLink>
        {isCompanyUser && <NavLink to="/my-company" className="list-group-item list-group-item-secondary" >my company</NavLink>}
        <NavLink to="/company" className="list-group-item list-group-item-secondary">companies</NavLink>
        <NavLink to="/transport" className="list-group-item list-group-item-secondary">transports</NavLink>
        <NavLink to="/routes" className="list-group-item list-group-item-secondary">routes</NavLink>
      </ListGroup>
    </div>
  )
}

export default Sidebar;