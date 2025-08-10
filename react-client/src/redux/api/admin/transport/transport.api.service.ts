import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQuery, queryWithParams} from "../company/company.api.service";
import {BASE_URL} from "../../../constants/urls_constants";
import {toast} from "react-toastify";
import {toastOptions} from "../../../../toast/toastOptions";
import {ErrorResponseTypes} from "../../auth/types";
import {ErrorCode} from "../../../constants/error_response/error_codes";
import {ERROR_MESSAGES} from "../../../constants/error_response/error_messages";

export const transportApiService = createApi({
  reducerPath: 'api/transport',
  baseQuery,
  tagTypes: ['Transport', 'Company'],
  endpoints: (builder) => ({
    createTransport: builder.mutation({
      query: (body) => ({
        url: `${BASE_URL}/transport`,
        method: 'POST',
        body
      }),
      transformResponse: (res: any) => {
        if (res && res.success === true) {
          toast(res.message, toastOptions('success'))
          return res.success
        }
      },
      transformErrorResponse: (err: ErrorResponseTypes) => {
        if (err && err.status === 400) {
          return err.data.errors
        }
      },
      invalidatesTags: [{type: 'Transport'}]
    }),
    getTransports: builder.query({
      query: (params) => queryWithParams('/transport?', params),
      transformResponse: (res: any) => {
        return res
      },
      transformErrorResponse: (err) => {
        console.log('transports error ', err)
        if(err.status === ErrorCode.FETCH_ERROR) toast(ERROR_MESSAGES.FETCH_ERROR, toastOptions('error'))
      },
      providesTags: (result: any) => result
        ? [
          ...result.data.map(({id}: any) => ({type: 'Transport' as const, id})),
          {type: 'Transport', id: 'LIST'},
        ]
        : [{type: 'Transport', id: 'LIST'}],
    }),
    updateTransport: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/transport/${data.id}`,
        method: 'PUT',
        body: data.body,
        headers: {
          'Content-Type': 'application/json',
        }
      }),
      transformResponse: (res: any) => {
        if (res && res.success === true) {
          toast(res.message, toastOptions('success'))
        }
      },
      transformErrorResponse: (err: ErrorResponseTypes) => {
        console.log('updated err :', err)
        if (err.status === 400) {
          return err.data.errors
        }
      },
      invalidatesTags: (result, error, {id}) => [{type: 'Transport', id}]
    }),
    deleteAllTransports: builder.mutation({
      query: (body: any) => ({
        url: `${BASE_URL}/transport/bulk-delete`,
        method: 'DELETE',
        body: JSON.stringify(body)
      }),
      transformResponse: (res: any) => {
        console.log('bulk delete success:', res)
        if (res && res.success === true) {
          toast(res.message, toastOptions('success'))
          return res.success
        }
      },
      transformErrorResponse: (err: any) => {
        console.log('bulk delete err :', err)
      },
      invalidatesTags: [{type: 'Transport'}]
    })
  })
})

export const {
  useCreateTransportMutation,
  useGetTransportsQuery,
  useUpdateTransportMutation,
  useDeleteAllTransportsMutation
} = transportApiService