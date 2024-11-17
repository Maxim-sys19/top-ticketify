import React from 'react'
import PublicRoutes from "./PublicRoutes";
import HomePageContainer from "../Pages/HomePageContainer";
import LoginPageContainer from "../Pages/LoginPageContainer";
import RegisterPageContainer from "../Pages/RegisterPageContainer";
import GuardRoutes from "./GuardRoutes";
import ProfilePageContainer from "../Pages/ProfilePageContainer";
import ForgotPasswordContainer from "../Pages/ForgotPasswordContainer";
import ResetPasswordContainer from "../Pages/ResetPasswordContainer";

export type IRoute = {
  path: string;
  element: React.ReactNode;
}

export interface RoutesTypes {
  element: React.ReactNode,
  children: IRoute[]
}

export const routes: RoutesTypes[] = [
  {
    element: <PublicRoutes />,
    children: [
      {path: '/', element: <HomePageContainer />},
      {path: '/login', element: <LoginPageContainer />},
      {path: '/register', element: <RegisterPageContainer />},
      {path: '/forgot-password', element: <ForgotPasswordContainer />},
      {path: '/reset-password', element: <ResetPasswordContainer />},
    ]
  },
  {
    element: <GuardRoutes />,
    children: [
      {path: '/profile', element: <ProfilePageContainer />},
    ]
  }
]