import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {logoutAction} from "../profile/logout.api.service";

export interface TokenState {
  token: string | null;
}

const initialState: TokenState = {
  token: localStorage.getItem("jwtToken"),
}

const authTokenSlice = createSlice({
  name: 'auth/token',
  initialState,
  reducers: {
    setToken: (state: TokenState, action: PayloadAction<TokenState>) => {
      const {token} = action.payload;
      state.token = token;
    },
  },
  extraReducers: builder => {
    builder.addCase(logoutAction.fulfilled, (state, action) => {
      const {payload} = action
      state.token = payload
    })
  }
})

export const {setToken} = authTokenSlice.actions;
export default authTokenSlice.reducer;