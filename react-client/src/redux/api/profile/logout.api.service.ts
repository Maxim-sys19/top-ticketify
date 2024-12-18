import {createAsyncThunk} from "@reduxjs/toolkit";
import {clearProfile} from "./profile.slice";

export const logoutAction = createAsyncThunk('/logout', async (_, {dispatch}) => {
  localStorage.removeItem('jwtToken')
  dispatch(clearProfile())
  return null
})