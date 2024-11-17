import {createSlice, PayloadAction} from "@reduxjs/toolkit";

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
    logout: (state: TokenState) => {
      localStorage.removeItem("jwtToken");
      state.token = null;
    }
  }
})

export const {setToken, logout} = authTokenSlice.actions;
export default authTokenSlice.reducer;