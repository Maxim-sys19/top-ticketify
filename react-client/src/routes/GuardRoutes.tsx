import React from 'react';
import {Navigate, Outlet, useLocation} from "react-router-dom";
import {isAuth} from "../helpers/isAuth";
import {useAppSelector} from "../hooks/useApiHooks";

const GuardRoutes = () => {
  const location = useLocation()
  const token = useAppSelector(state => state.jwtToken.token)
  const auth = isAuth(token)
  if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password') {
    return <Navigate to="/profile"/>
  }
  return !auth ? <Outlet /> : <Navigate to="/login" state={{from: location}} replace/>;
};

export default GuardRoutes;