import React from 'react'
import PublicRoutes from "./PublicRoutes";
import HomePageContainer from "../Pages/HomePageContainer";
import LoginPageContainer from "../Pages/Login/LoginPageContainer";
import RegisterPageContainer from "../Pages/Register/RegisterPageContainer";
import GuardRoutes from "./GuardRoutes";
import ProfilePageContainer from "../Pages/ProfilePageContainer";
import ForgotPasswordContainer from "../Pages/ForgotPassword/ForgotPasswordContainer";
import ResetPasswordContainer from "../Pages/ResetPasswordContainer";
import Dashboard from "../Pages/Admin/Dashboard";
import Company from "../Pages/Admin/Companies/Company";
import AdminRoutes from "./AdminRoutes";
import AdminLayout from "../Pages/Admin/AdminLayout";
import TransportPage from "../Pages/Admin/Transport/TransportPage";
import RoutesPage from '../Pages/Admin/Routes/RoutesPage';
import MyCompany from "../Pages/Admin/MyCompany/MyCompany";

export type IRoute = {
  path: string;
  element: React.ReactNode;
  isPrivate: boolean
}

export interface RoutesTypes {
  element: React.ReactNode,
  children: IRoute[]
}

export const routes: RoutesTypes[] = [
  {
    element: <PublicRoutes />,
    children: [
      {path: '/', element: <HomePageContainer />, isPrivate: false},
      {path: '/login', element: <LoginPageContainer />, isPrivate: false},
      {path: '/register', element: <RegisterPageContainer />, isPrivate: false},
      {path: '/forgot-password', element: <ForgotPasswordContainer />, isPrivate: false},
      {path: '/reset-password', element: <ResetPasswordContainer />, isPrivate: false},
    ]
  },
  {
    element: <GuardRoutes />,
    children: [
      {path: '/profile', element: <ProfilePageContainer />, isPrivate: true},
    ]
  },
  {
    element: <AdminRoutes>
      <AdminLayout />
    </AdminRoutes>,
    children: [
      {path: '/dashboard', element: <Dashboard />, isPrivate: true},
      {path: '/my-company', element: <MyCompany />, isPrivate: true},
      {path: '/company', element: <Company />, isPrivate: true},
      {path: '/transport', element: <TransportPage />, isPrivate: true},
      {path: '/routes', element: <RoutesPage />, isPrivate: true},
    ]
  }
]