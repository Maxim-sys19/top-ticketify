import React from 'react';
import {useAppSelector} from "../hooks/useApiHooks";
import {isAdmin} from "../helpers/isAdmin";
import {Navigate, useLocation} from "react-router-dom";

function AdminRoutes({children}: any) {
  const {roles} = useAppSelector(state => state.profile.user)
  const location = useLocation()
  const adminPanel = roles && isAdmin(roles)
  if (!adminPanel) {
    return (
      <>
        <p className="text-center">loading...</p>
        <Navigate to="/profile" />
      </>
    )
  }
  if (adminPanel) {
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