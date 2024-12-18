import React from 'react';
import {Outlet} from "react-router-dom";
import {useAppSelector} from "../hooks/useApiHooks";
import {isAuth} from "../helpers/isAuth";
import GuardRoutes from "./GuardRoutes";

const PublicRoutes = () => {
  const {token} = useAppSelector(state => state.jwtToken)
  const auth = isAuth(token)
  return auth ? <Outlet /> : <GuardRoutes />
}

export default PublicRoutes;