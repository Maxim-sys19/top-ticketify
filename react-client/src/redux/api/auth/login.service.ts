import {authService} from "./auth.service";
import {ErrorResponseTypes} from "./types";
import {toast} from "react-toastify";
import {toastOptions} from "../../../toast/toastOptions";
import {setToken} from "./authToken.slice";

export const loginService = authService.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: '/login',
        method: 'POST',
        body,
      }),
      onQueryStarted: async (arg, {dispatch, queryFulfilled}) => {
        try {
          const {data} = await queryFulfilled
          localStorage.setItem("jwtToken", data)
          dispatch(setToken({token: data}));
        } catch (error) {
          console.log('queryFulfilled error :', error)
        }
      },
      transformResponse: (response: any) => {
        if (response.hasOwnProperty('success') && response.success === true) {
          toast(response.message, toastOptions('success'));
        }
        return response.token;
      },
      transformErrorResponse: (error: ErrorResponseTypes) => {
        if (error && error.status === 404) {
          toast(error.data.message, toastOptions('error'));
        }
        if (error && error.status === 400) {
          if ('data' in error && 'statusCode' in error.data && error.data.statusCode === 400) {
            toast(error.data.message, toastOptions('error'));
          }
          return error.data.errors
        }
      },
    })
  }),
  overrideExisting: false
})
export const {useLoginMutation} = loginService;