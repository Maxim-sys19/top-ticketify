import {createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "../../store";
import {toast} from "react-toastify";
import {toastOptions} from "../../../toast/toastOptions";
import {logoutAction} from "./logout.api.service";
import { NavigateFunction } from "react-router-dom";

export const profileAction = createAsyncThunk('/profile', async (navigate: NavigateFunction, {getState, dispatch, rejectWithValue}) => {
  try {
    const token = (getState() as RootState).jwtToken.token
    const base64Url = token?.split('.')[1]
    const base64 = base64Url!.replace(/-/g, '+').replace(/_/g, '/')
    const currTime = Math.floor(Date.now() / 1000)
    const decodeJwt = JSON.parse(atob(base64))
    const jwtExpTime = decodeJwt.exp
    const remainingTime = (jwtExpTime - currTime) * 1000;
    console.log(remainingTime)
    if (remainingTime <= 0) {
      dispatch(logoutAction(navigate))
      toast('session has been expired', toastOptions('error'))
    }
    return {user: decodeJwt.user}
  } catch (err) {
    return rejectWithValue(err)
  }
})