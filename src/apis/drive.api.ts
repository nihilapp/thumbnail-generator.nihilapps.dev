/* eslint-disable camelcase */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { drive_v3 } from 'googleapis';
import { GaxiosResponse } from 'gaxios';
import { configData } from '../data';
import { CreateFolder, UploadImage } from '../types/api.types';

export const driveApi = createApi({
  reducerPath: 'driveApi',
  refetchOnFocus: false,
  tagTypes: [ 'Drive', ],
  baseQuery: fetchBaseQuery({
    baseUrl: `${configData.url}/api/drive`,
  }),
  endpoints: (builder) => ({
    getFolders: builder.query<drive_v3.Schema$FileList, void>({
      query: () => '/folders',
      providesTags: [ 'Drive', ],
    }),
    createFolder: builder.mutation<GaxiosResponse<drive_v3.Schema$File>, CreateFolder>({
      query: (createFolder) => ({
        url: '/folders',
        method: 'POST',
        body: createFolder,
      }),
      invalidatesTags: [ 'Drive', ],
    }),
    uploadImage: builder.mutation<GaxiosResponse<drive_v3.Schema$File>, UploadImage>({
      query: (uploadImage) => ({
        url: '/images',
        method: 'POST',
        body: uploadImage,
      }),
    }),
  }),
});

export const {
  useGetFoldersQuery,
  useCreateFolderMutation,
  useUploadImageMutation,
} = driveApi;
