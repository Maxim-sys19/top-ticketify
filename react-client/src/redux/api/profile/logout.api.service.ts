import {createAsyncThunk} from "@reduxjs/toolkit";
import { NavigateFunction } from "react-router-dom";
import {clearProfile} from "./profile.slice";

export const logoutAction = createAsyncThunk('/logout', async (_, {dispatch}) => {
  localStorage.removeItem('jwtToken')
  dispatch(clearProfile())
  // window.google?.accounts.id.disableAutoSelect();
  return null
})