import {authService} from "./auth.service";
import {ValidationError} from "../../../helpers/parseErrors";
import {ErrorResponseTypes} from "./types";
import {toast} from "react-toastify";
import {toastOptions} from "../../../toast/toastOptions";

export const forgotPasswordService = authService.injectEndpoints({
  endpoints: builder => ({
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: `/forgot-password`,
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        body,
      }),
      transformResponse: (response: any) => {
        if (response.success === true) {
          toast(response.message, toastOptions('success'));
        }
        return response;
      },
      transformErrorResponse: (error: ErrorResponseTypes): ValidationError[] | undefined => {
        if (error && error.status === 404) {
          toast(error.data.message, toastOptions('error'))
        }
        if (error && error.status === 400) {
          return error.data.errors;
        }
      }
    }),
    resetPassword: builder.mutation({
      query: (body) => ({
        url: `/reset-password`,
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        body
      }),
      transformResponse: (response: any) => {
        if(response.success === true) {
          toast(response.message, toastOptions('success'));
        }
        return response
      },
      transformErrorResponse: (error: ErrorResponseTypes) => {
        if (error && error.status === 404) {
          toast(error.data.message, toastOptions('error'));
        }
        if (error && error.status === 400) {
          if ('statusCode' in error.data && error.data.statusCode === 400) {
            toast(error.data.message, toastOptions('error'));
          }
          return error.data.errors
        }
      }
    })
  }),
  overrideExisting: true,
});

export const {useForgotPasswordMutation, useResetPasswordMutation} = forgotPasswordService