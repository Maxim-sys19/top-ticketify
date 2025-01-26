import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQuery, queryWithParams} from "../company/company.api.service";
import {BASE_URL} from "../../../utils";
import {toast} from "react-toastify";
import {toastOptions} from "../../../../toast/toastOptions";
import {ErrorResponseTypes} from "../../auth/types";
import {ValidationError} from "../../../../helpers/parseErrors";

export const transportApiService = createApi({
  reducerPath: 'api/transport',
  baseQuery,
  tagTypes: ['Transport'],
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
      },
      providesTags: (result: any) => {
        return result ? result.data.map(({id}: any) => ({type: 'Transport', id})) : ['Transport']
      }
    }),
    updateTransport: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/transport/${data.id}`,
        method: 'PUT',
        body: JSON.stringify(data.body)
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
      invalidatesTags: [{type: 'Transport'}],
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

export const {useCreateTransportMutation, useGetTransportsQuery, useUpdateTransportMutation, useDeleteAllTransportsMutation} = transportApiService