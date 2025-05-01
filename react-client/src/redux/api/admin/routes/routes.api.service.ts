import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQuery, queryWithParams} from "../company/company.api.service";
import {BASE_URL} from "../../../utils";
import {ErrorResponseTypes} from "../../auth/types";
import {toast} from "react-toastify";
import {toastOptions} from "../../../../toast/toastOptions";

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
        console.log('create rote with success :', res);
        return res.success;

      },
      transformErrorResponse: (err: ErrorResponseTypes) => {
        if (err.status === 400) {
          return err.data.errors
        }
      },
      invalidatesTags: [{type: 'Route'}]
    }),
    getRoutes: builder.query({
      query: (params) => queryWithParams('/routes?', params),
      transformResponse: (res: any) => {
        return res;
      },
      transformErrorResponse: (err: any) => {
        console.log('getRoutes with error :', err);
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
        if (err.status === 400) {
          return err.data.errors
        }
      },
      invalidatesTags: (result: any, error, {id}): any => [{type: 'Route', id}],
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