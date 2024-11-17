import {authService} from "./auth.service";
import {ErrorResponseTypes} from "./types";
import {toast} from "react-toastify";
import {toastOptions} from "../../../toast/toastOptions";

export const registerService = authService.injectEndpoints({
  endpoints: (builder) => ({
    registration: builder.mutation({
      query: (body) => ({
        url: '/register',
        method: 'POST',
        body,
      }),
      transformResponse: (response: any) => {
        if (response.success === true) {
          toast(response.message, toastOptions('success'))
        }
        return response;
      },
      transformErrorResponse: (error: ErrorResponseTypes,) => {
        if (error && error.status === 400) {
          if (error && 'data' in error && 'statusCode' in error.data && error.data.statusCode === 400) {
            toast(error.data.message, toastOptions('error'));
          }
          return error.data.errors;
        }
      }
    }),
  }),
  overrideExisting: false
})

export const {useRegistrationMutation} = registerService;