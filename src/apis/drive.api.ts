/* eslint-disable camelcase */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { drive_v3 } from 'googleapis';
import { GaxiosResponse } from 'gaxios';
import { configData } from '../data';
import { CreateFolder, UploadImage } from '../types/api.types';

type DriveResponse = GaxiosResponse<drive_v3.Schema$File>;

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
    createFolder: builder.mutation<DriveResponse, CreateFolder>({
      query: (createFolder) => ({
        url: '/folders',
        method: 'POST',
        body: createFolder,
      }),
      invalidatesTags: [ 'Drive', ],
    }),
    uploadImage: builder.mutation<DriveResponse, UploadImage>({
      query: (uploadImage) => ({
        url: '/images',
        method: 'POST',
        body: uploadImage,
      }),
      invalidatesTags: [ 'Drive', ],
    }),
  }),
});

export const {
  useGetFoldersQuery,
  useCreateFolderMutation,
  useUploadImageMutation,
} = driveApi;
