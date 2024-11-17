import {AUTH_URL} from "../../utils";
import {RootState} from "../../store";
import {createAsyncThunk} from "@reduxjs/toolkit";

export const profileApiThunk = createAsyncThunk('profile/fetchProfile',
  async (_, {dispatch, getState, rejectWithValue}) => {
    const token = (getState() as RootState).jwtToken.token
    await fetch(`${AUTH_URL}/profile`, {
      headers: {'Authorization': `Bearer ${token}`}
    }).then((response) => {
      console.log('success res :', response)
    }).catch((error) => {
      console.log('error res :', error)
      return rejectWithValue(error)
    })

  })