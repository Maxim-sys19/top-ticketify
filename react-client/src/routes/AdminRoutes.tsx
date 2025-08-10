import React from 'react';
import {Navigate, useLocation} from "react-router-dom";
import {useRoles} from '../hooks/useRoles';
import {CompanyUserContext} from "../context/user/UserContext";

function AdminRoutes({children}: any) {
  const {isAdmin, isCompany, isAuth} = useRoles()
  const location = useLocation()
  const auth = isAuth
  const isAdminUser = isAdmin()
  const isCompanyUser = isCompany()
  if (!isAdminUser && !isCompanyUser) {
    return (
      <>
        <p className="text-center">loading...</p>
        <Navigate to="/profile" />
      </>
    )
  }
  if (isCompanyUser || isAdminUser) {
    return (
      <>
        <Navigate to={location.pathname} />
        <CompanyUserContext.Provider value={isCompanyUser}>
          {children}
        </CompanyUserContext.Provider>
      </>
    )
  }
  if (!auth) <Navigate to="/login" />
  return <>
    {children}
  </>
}

export default AdminRoutes;