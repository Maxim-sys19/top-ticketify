import {createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "../../store";
import {toast} from "react-toastify";
import {toastOptions} from "../../../toast/toastOptions";
import {logoutAction} from "./logout.api.service";

export const profileAction = createAsyncThunk('/profile', async (_, {getState, dispatch, rejectWithValue}) => {
  try {
    const token = (getState() as RootState).jwtToken.token
    const base64Url = token?.split('.')[1]
    const base64 = base64Url!.replace(/-/g, '+').replace(/_/g, '/')
    const currTime = Math.floor(Date.now() / 1000)
    const decodeJwt = JSON.parse(atob(base64))
    const jwtExpTime = decodeJwt.exp
    const remainingTime = (jwtExpTime - currTime) * 1000;
    setTimeout(() => {
      dispatch(logoutAction())
      toast('your session is expired', toastOptions('error'))
      console.log('jwt expired')
    }, remainingTime)
    return {user: decodeJwt.user}
  } catch (err) {
    return rejectWithValue(err)
  }
})