import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {OAUTH_URL} from "../../constants/urls_constants";
import {toast} from "react-toastify";
import {toastOptions} from "../../../toast/toastOptions";
import {setToken} from "./authToken.slice";

export const oauthService = createApi({
  reducerPath: 'api/oauth',
  baseQuery: fetchBaseQuery({baseUrl: `${OAUTH_URL}`}),
  endpoints: (builder: any) => ({})
})

export const oauthGoogleLoginService = oauthService.injectEndpoints({
  endpoints: (builder) => ({
    oauthGoogleLogin: builder.mutation({
      query: (id_token) => ({
        url: '/google/login',
        method: 'POST',
        body: {id_token}
      }),
      onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
        try {
          const {data} = await queryFulfilled
          localStorage.setItem("jwtToken", data.token)
          dispatch(setToken({token: data.token}));
        } catch (error) {
          console.log('queryFulfilled oauthGoogle error :', error)
        }
      },
      transformResponse: (res: any) => {
        if (res.success) {
          toast(`${res.email} logged in!`, toastOptions('success'))
        }
        return {token: res.token}
      },
      transformErrorResponse: (err) => {
        console.log('oauthGoogleLogin err', err)
      }
    })
  }),
  overrideExisting: false
})

export const {useOauthGoogleLoginMutation} = oauthGoogleLoginService