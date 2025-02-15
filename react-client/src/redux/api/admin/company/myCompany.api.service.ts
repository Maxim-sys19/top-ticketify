import {createApi} from "@reduxjs/toolkit/query/react";
import {BASE_URL} from "../../../utils";
import {baseQuery} from "./company.api.service";

export const myCompanyApiService = createApi({
  reducerPath: 'api/myCompany',
  baseQuery,
  endpoints: (builder) => ({
    fetchMyCompany: builder.query({
      query: (_) => ({
        url: `${`${BASE_URL}/my-company`}`,
        method: 'GET',
      }),
      transformResponse: (res: any) => {
        console.log('myCompanyApiService transformResponse ', res);
      },
      transformErrorResponse: (res: any) => {
        console.log('myCompanyApiService transformErrorResponse ', res);
      }
    })
  })
})

export const {useFetchMyCompanyQuery} = myCompanyApiService