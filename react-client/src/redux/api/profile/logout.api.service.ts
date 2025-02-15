import {createAsyncThunk} from "@reduxjs/toolkit";
import { NavigateFunction } from "react-router-dom";
import {clearProfile} from "./profile.slice";

export const logoutAction = createAsyncThunk('/logout', async (navigate:NavigateFunction, {dispatch}) => {
  localStorage.removeItem('jwtToken')
  dispatch(clearProfile())
  navigate('/login')
  return null
})