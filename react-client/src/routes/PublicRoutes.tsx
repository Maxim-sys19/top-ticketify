import React from 'react';
import {Outlet} from "react-router-dom";
import {useAppSelector} from "../hooks/useApiHooks";
import { useRoles } from '../hooks/useRoles';
import GuardRoutes from "./GuardRoutes";

const PublicRoutes = () => {
  const {isAuth} = useRoles()
  const auth = isAuth
  return auth ? <Outlet /> : <GuardRoutes />
}

export default PublicRoutes;