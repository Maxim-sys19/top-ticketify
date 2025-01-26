import React from 'react';
import {useAppSelector} from "../hooks/useApiHooks";
import {isAdmin, isCompany} from "../helpers/isAdmin";
import {Navigate, useLocation} from "react-router-dom";

function AdminRoutes({children}: any) {
  const {roles} = useAppSelector(state => state.profile.user)
  const location = useLocation()
  const isAdminUser = roles && isAdmin(roles)
  const isCompanyUser = roles && isCompany(roles)
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
        <Navigate to={location.pathname}/>
        {children}
      </>
  )
  }
  return <>{children}</>
}

export default AdminRoutes;