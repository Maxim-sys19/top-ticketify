import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQuery, queryWithParams} from "../company/company.api.service";
import {BASE_URL} from "../../../constants/urls_constants";
import {ErrorResponseTypes} from "../../auth/types";
import {toast} from "react-toastify";
import {toastOptions} from "../../../../toast/toastOptions";
import {ErrorCode} from "../../../constants/error_response/error_codes";
import {ERROR_MESSAGES} from "../../../constants/error_response/error_messages";

export const routesApiService = createApi({
  reducerPath: 'api/routes',
  baseQuery,
  tagTypes: ['Route'],
  endpoints: (builder) => ({
    createRoute: builder.mutation({
      query: (body) => ({
        url: `${BASE_URL}/routes`,
        method: 'POST',
        body
      }),
      transformResponse: (res: any) => {
        console.log('create route success', res)
        if (res.success) toast("created", toastOptions("success"))
        return res.success;

      },
      transformErrorResponse: (err: ErrorResponseTypes) => {
        console.log('create route Error: ', err)
        if (err.status >= 500) toast(err.data.message || ERROR_MESSAGES.BAD_GATEWAY, toastOptions('error'))
        if (err.data.errors) {
          return err.data.errors
        }
        if (err.status === 400) toast(err.data.message, toastOptions('error'))
      },
      invalidatesTags: [{type: 'Route'}]
    }),
    getRoutes: builder.query({
      query: (params) => queryWithParams('/routes?', params),
      transformResponse: (res: any) => {
        let formatedData = res.data.map((el: any) => ({
          ...el,
          departureTime: new Date(el.departureTime).toLocaleString(),
          arrivalTime: new Date(el.arrivalTime).toLocaleString(),
        }))
        return {...res, data: formatedData};
      },
      transformErrorResponse: (err: any) => {
        console.log('getRoutes with error :', err);
        if (err.status === ErrorCode.FETCH_ERROR) toast(ERROR_MESSAGES.FETCH_ERROR, toastOptions('error'))
      },
      providesTags: (result: any): any => {
        return result?.data ?
          [
            ...result.data.map(({id}: any) => ({type: 'Route' as const, id})),
            {type: 'Route', id: 'LIST'},
          ] : ['Route']
      }
    }),
    updateRoute: builder.mutation({
      query: (data: any) => ({
        url: `${BASE_URL}/routes/${data.id}`,
        method: 'PUT',
        body: JSON.stringify({
          routeName: data.routeName,
          start: data.start,
          end: data.end,
          departureTime: data.departureTime,
          arrivalTime: data.arrivalTime
        }),
      }),
      transformResponse: (res: any) => {
        if (res.success === true) {
          toast(res.message, toastOptions('success'));
        }
      },
      transformErrorResponse: (err: ErrorResponseTypes) => {
        console.log('update route err :', err)
        if (err.status >= 500) toast(err.data.message || ERROR_MESSAGES.BAD_GATEWAY, toastOptions('error'))
        if (err.status === 404) toast(err.data.message, toastOptions('error'))
        if (err.status === 400) {
          return err.data.errors
        }
      },
      invalidatesTags: (_, __, {id}): any => [{type: 'Route', id}],
    }),
    deleteRoutes: builder.mutation({
      query: (body) => ({
        url: `${BASE_URL}/routes/bulk-delete`,
        method: 'DELETE',
        body
      }),
      transformResponse: (res: any) => {
        if (res.success === true) {
          toast(res.message, toastOptions('success'));
        }
        return res;
      },
      transformErrorResponse: (err) => {
        console.log('getRoutes with error :', err);
      },
      invalidatesTags: (_result, error, body: any): any => {
        console.log('routes invalidated tags : ', body);
        return [
          ...body.ids.map((id: number) => ({type: 'Route' as const, id})),
          {type: 'Route', id: 'LIST'},
        ]
      }
    })
  })
})

export const {
  useCreateRouteMutation,
  useGetRoutesQuery,
  useDeleteRoutesMutation,
  useUpdateRouteMutation
} = routesApiService