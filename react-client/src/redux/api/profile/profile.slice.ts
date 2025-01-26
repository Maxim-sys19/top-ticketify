import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {profileAction} from "./profile.api.service";

export interface ProfileState {
  user: {
    id: string | number,
    email: string,
    name: string,
    password?: string | number
    avatar: any | null
    status: string,
    roles: {id: string | number, role_name: string}[]
  }
}
const initialState: ProfileState = {
  user: {
    id: '',
    email: '',
    name: '',
    avatar: null,
    status: '',
    roles: []
  }
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.user.id = ''
      state.user.email = ''
      state.user.name = ''
      state.user.avatar = ''
      state.user.status = ''
      state.user.roles = []
    }
  },
  extraReducers: builder => {
    builder.addCase(profileAction.fulfilled, (state: ProfileState, action: PayloadAction<ProfileState>) => {
      const {payload} = action
      if(JSON.stringify(state.user.email) === JSON.stringify(payload.user.email)) {
        return state
      }
      state.user.id = payload.user.id
      state.user.email = payload.user.email
      state.user.name = payload.user.name
      state.user.avatar = payload.user.avatar
      state.user.status = payload.user.status
      state.user.roles = payload.user.roles
    })
  }
})

export const {clearProfile} = profileSlice.actions
export default profileSlice.reducer