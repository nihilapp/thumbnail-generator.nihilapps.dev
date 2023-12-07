/* eslint-disable camelcase */
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { apiGet, apiPost } from '@/src/utils/axios';
import { ApiResponse, CreateFolder, UploadImage } from '@/src/types/api.types';
import { drive_v3 } from 'googleapis';
import { GaxiosResponse } from 'gaxios';

type DriveItemList = drive_v3.Schema$FileList;
type DriveItem = GaxiosResponse<drive_v3.Schema$File>;

export const useGetFolders = () => {
  const {
    data = [],
    isSuccess,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<ApiResponse<DriveItemList>, AxiosError>({
    queryKey: [ 'getFolders', ],
    queryFn: async () => {
      const { data, } = await apiGet<ApiResponse<DriveItemList>>('/drive/folders');

      return data;
    },
  });

  return {
    foldersData: data as ApiResponse<DriveItemList>,
    foldersIsSuccess: isSuccess,
    foldersIsLoading: isLoading,
    foldersIsFetching: isFetching,
    foldersIsError: isError,
    foldersError: error,
    foldersRefetch: refetch,
  };
};

export const useCreateFolder = () => {
  const {
    data,
    isSuccess,
    isError,
    error,
    mutate,
  } = useMutation<ApiResponse<DriveItem>, AxiosError, CreateFolder>({
    mutationFn: async (createFolder: CreateFolder) => {
      const { data, } = await apiPost<ApiResponse<DriveItem>, CreateFolder>('/drive/folders', createFolder);

      return data;
    },
  });

  return {
    createFolderData: data,
    createFolderIsSuccess: isSuccess,
    createFolderIsError: isError,
    createFolderError: error,
    createFolderMutate: mutate,
  };
};

export const useUploadImage = () => {
  const {
    data,
    isSuccess,
    isError,
    error,
    mutate,
  } = useMutation<ApiResponse<DriveItem>, AxiosError, UploadImage>({
    mutationFn: async (uploadImage: UploadImage) => {
      const { data, } = await apiPost<ApiResponse<DriveItem>, UploadImage>('/drive/images', uploadImage);

      return data;
    },
  });

  return {
    uploadImageData: data,
    uploadImageIsSuccess: isSuccess,
    uploadImageIsError: isError,
    uploadImageError: error,
    uploadImageMutate: mutate,
  };
};
