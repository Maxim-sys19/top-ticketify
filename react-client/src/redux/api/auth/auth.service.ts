import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {AUTH_URL} from '../../utils';

export const authService = createApi({
  reducerPath: 'api/auth',
  baseQuery: fetchBaseQuery({baseUrl: `${AUTH_URL}`}),
  endpoints: (builder: any) => ({})
})

