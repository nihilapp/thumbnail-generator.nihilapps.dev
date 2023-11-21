/* eslint-disable camelcase */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { drive_v3 } from 'googleapis';
import { configData } from '../data';

export const driveApi = createApi({
  reducerPath: 'driveApi',
  refetchOnFocus: false,
  tagTypes: [ 'Folders', ],
  baseQuery: fetchBaseQuery({
    baseUrl: `${configData.url}/api/drive/folders`,
  }),
  endpoints: (builder) => ({
    getFolders: builder.query<drive_v3.Schema$FileList, void>({
      query: () => '/',
      providesTags: [ 'Folders', ],
    }),
  }),
});

export const {
  useGetFoldersQuery,
} = driveApi;
