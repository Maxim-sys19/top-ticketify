import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_URL} from "../../utils";
import {RootState} from "../../store";
import {ErrorResponseTypes} from "../auth/types";
import {toast} from "react-toastify";
import {toastOptions} from "../../../toast/toastOptions";

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
       return result ? result.data.map(({id}: any) => ({type: 'Company', id})): ['Company']
      }
    }),
  })
})

export const {useCreateCompanyMutation, useGetCompaniesQuery} = companyApiService