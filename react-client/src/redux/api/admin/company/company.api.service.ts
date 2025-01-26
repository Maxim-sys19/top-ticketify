import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_URL} from "../../../utils";
import {RootState} from "../../../store";
import {ErrorResponseTypes} from "../../auth/types";
import {toast} from "react-toastify";
import {toastOptions} from "../../../../toast/toastOptions";

export const baseQuery = fetchBaseQuery({
  prepareHeaders: (headers, {getState}) => {
    const {token} = (getState() as RootState).jwtToken
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
      headers.set('Content-Type', 'application/json')
    }
  }
})

export const queryWithParams = (base: string, params: any) => {
  const queryParams = new URLSearchParams()
  if (params?.limit) queryParams.append('limit', params.limit)
  if (params?.page) queryParams.append('page', params.page)
  return {
    url: `${BASE_URL}${base}${queryParams.toString()}`,
    method: 'GET'
  }
}

export const companyApiService = createApi({
  reducerPath: 'api/company',
  baseQuery,
  tagTypes: ['Company'],
  endpoints: (builder) => ({
    createCompany: builder.mutation({
      query: (body) => ({
        url: `${BASE_URL}/company`,
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
      query: (params) => queryWithParams('/company?', params),
      transformResponse: (res: any) => {
        // console.log('companies ', res.data)
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
        url: `${BASE_URL}/company/${id}`,
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
        url: `${BASE_URL}/company/bulk-delete`,
        method: 'DELETE',
        body
      }),
      invalidatesTags: (result, error, {id}) => [{type: 'Company', id}],
      transformResponse: (res: any) => {
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