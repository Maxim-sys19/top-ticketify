import React from 'react';
import {Navigate, Outlet, useLocation} from "react-router-dom";
import { useRoles } from '../hooks/useRoles';

const GuardRoutes = () => {
  const {isAuth} = useRoles()
  const location = useLocation()
  const auth = isAuth
  if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password') {
    return <Navigate to="/profile"/>
  }
  return !auth ? <Outlet /> : <Navigate to="/login" state={{from: location}} replace/>;
};

export default GuardRoutes;