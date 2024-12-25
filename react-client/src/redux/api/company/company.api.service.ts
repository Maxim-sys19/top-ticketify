import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_URL} from "../../utils";
import {RootState} from "../../store";
import {ErrorResponseTypes} from "../auth/types";
import {toast} from "react-toastify";
import {toastOptions} from "../../../toast/toastOptions";
import {ValidationError} from "../../../helpers/parseErrors";

export const companyApiService = createApi({
  reducerPath: 'api/company',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/company`,
    prepareHeaders: (headers, {getState}) => {
      const {token} = (getState() as RootState).jwtToken
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
        headers.set('Content-Type', 'application/json')
      }
    }
  }),
  tagTypes: ['Company'],
  endpoints: (builder) => ({
    createCompany: builder.mutation({
      query: (body) => ({
        url: '',
        method: 'POST',
        body
      }),
      transformResponse: (res: any) => {
        toast(`${res.company.name} has been created`, toastOptions('success'))
        return res.status
      },
      transformErrorResponse: (err: ErrorResponseTypes) => {
        if (err && err.status === 400) {
          return err.data.errors
        }

      },
      invalidatesTags: [{type: 'Company'}]
    }),
    getCompanies: builder.query({
      query: ({limit, page}) => ({
        url: `?limit=${limit}&page=${page}`,
        method: 'GET'
      }),
      transformResponse: (res: any) => {
        return res
      },
      transformErrorResponse: (err: any) => {
        console.log('get companies error :', err)
      },
      providesTags: (result: any): any => {
        return result ? result.data.map(({id}: any) => ({type: 'Company', id})) : ['Company']
      }
    }),
    updateCompany: builder.mutation({
      query: ({id, body}: any) => ({
        url: `/${id}`,
        method: 'PUT',
        body: JSON.stringify(body)
      }),
      invalidatesTags: (result, error, {id}) => [{type: 'Company', id}],
      transformResponse: (res: any) => {
        if (res.success && res.success === true) {
          toast(res.message, toastOptions('success'))
        }
      },
      transformErrorResponse: (err: any) => {
        if (err && err.status === 400) {
          return err.data.errors
        }
      }
    }),
    deleteAllCompanies: builder.mutation({
      query: (body) => ({
        url: `/bulk-delete`,
        method: 'DELETE',
        body
      }),
      invalidatesTags: (result, error, {id}) => [{type: 'Company', id}],
      transformResponse: (res: any) => {
        console.log('D success: ', res)
        if (res.success && res.success === true) {
          toast(res.message, toastOptions('success'))
        }
        return res.success
      },
      transformErrorResponse: (err: any) => {
        console.log('D err :', err)
      }
    })
  })
})

export const {
  useCreateCompanyMutation,
  useGetCompaniesQuery,
  useUpdateCompanyMutation,
  useDeleteAllCompaniesMutation
} = companyApiService