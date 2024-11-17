import React from 'react';
import {Navigate, Outlet} from "react-router-dom";
import {isAuth} from "../helpers/isAuth";
import {useAppSelector} from "../hooks/useApiHooks";

const GuardRoutes = () => {
  const token = useAppSelector(state => state.jwtToken.token)
  return isAuth(token) ? <Navigate to={"/login"} /> : <Outlet />;
};

export default GuardRoutes;