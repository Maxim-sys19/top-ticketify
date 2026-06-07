import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQuery, queryWithParams} from "./company.api.service";

export const companyWithTransportsApiService = createApi({
  reducerPath: 'api/companies/transports',
  baseQuery,
  endpoints: (builder) => ({
    getAllCompaniesWithTransportsAndSeats: builder.query({
      query: (params) => queryWithParams('/company/transports/seats?', params),
      transformResponse: (res) => {
        console.log('Companies transports response :', res)
        return res
      },
      transformErrorResponse: (err: unknown) => {
        console.log('Companies transports err :', err)
      }
    })
  })
})
export const {useGetAllCompaniesWithTransportsAndSeatsQuery} = companyWithTransportsApiService