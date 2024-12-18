import React from 'react';
import '../../Components/NavBar/navbar.scss'
import './admin.scss'
import Sidebar from "../../Components/SideBar/Sidebar";
import {Outlet} from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="d-flex" style={{height: '86vh'}}>
      <Sidebar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout;