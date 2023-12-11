'use client';

import { Nihil } from '@/src/utils/nihil';
import { supabase } from '@/src/utils/supabase/client';
import { Icon } from '@iconify/react';
import React, {
  MouseEvent, useCallback, useEffect, useState
} from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { thumbnailStore } from '@/src/store/thumbnail.store';
import { authStore } from '@/src/store/auth.store';
import { useCreateFolder, useGetFolders, useUploadImage } from '@/src/hooks/query';
import { setIsShowPicker } from '@/src/store/common.store';
import { Heading } from '@/src/components/Base';
import { toast } from 'react-toastify';
import { IThumbnails } from '@/src/types/entity.types';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface Props {
  id: string;
  styles?: ClassNameValue;
}

interface Inputs {
  newFolderName: string;
}

export function GoogleDrivePicker({ id: thumbnailId, styles, }: Props) {
  const [ folderId, setFolderId, ] = useState('');
  const [ folderName, setFolderName, ] = useState('');
  const [ thumbnail, setThumbnail, ] = useState<IThumbnails>(null);

  const qc = useQueryClient();
  const router = useRouter();

  const { title, imageFileSrc, } = thumbnailStore();
  const { session, user, } = authStore();

  const {
    foldersData, foldersIsLoading, foldersIsFetching, foldersIsSuccess,
  } = useGetFolders();

  const { register, handleSubmit, } = useForm<Inputs>({
    mode: 'all',
  });

  const {
    createFolderData,
    createFolderIsSuccess,
    createFolderIsError,
    createFolderError,
    createFolderMutate,
  } = useCreateFolder();

  const {
    uploadImageData,
    uploadImageIsSuccess,
    uploadImageIsError,
    uploadImageError,
    uploadImageMutate,
  } = useUploadImage();

  // const [ createFolder, createResult, ] = useCreateFolderMutation();
  // const [ uploadImage, uploadResult, ] = useUploadImageMutation();

  useEffect(() => {
    (async () => {
      const { data: [ thumbnail, ], } = await supabase
        .from('thumbnails')
        .select()
        .eq('id', thumbnailId);

      setThumbnail(thumbnail);
    })();
  }, [ thumbnailId, ]);

  const onSubmitForm: SubmitHandler<Inputs> = useCallback(
    (data) => {
      createFolderMutate({
        folderName: data.newFolderName,
      }, {
        async onSuccess(response) {
          if (response.message === 'ok') {
            toast.success('폴더가 생성되었습니다.');
            await qc.invalidateQueries();
          }
        },
      });
    },
    []
  );

  const onClickBack = useCallback(
    () => {
      router.push(`/thumbnails/${thumbnailId}`);
    },
    [ thumbnailId, ]
  );

  const onClickSelectFolder = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const { id, } = event.currentTarget.dataset;

      const folder = foldersData.response.files.find((item) => item.id === id);

      setFolderId(id);
      setFolderName(folder.name);
    },
    [ foldersData, ]
  );

  const onClickUploadImage = useCallback(
    async () => {
      uploadImageMutate({
        folderId,
        imageFile: thumbnail.image_path,
        imageName: title,
      }, {
        onSuccess(response) {
          console.log(response);

          toast.success('이미지가 구글에 업로드되었습니다.');
        },
      });
    },
    [ folderId, thumbnailId, title, ]
  );

  const css = {
    default: twJoin([
      `bg-white z-50 overflow-y-scroll p-2 flex flex-col gap-5`,
      styles,
    ]),
    folders: twJoin([
      `flex flex-row gap-2 flex-wrap`,
    ]),
    folderItem: twJoin([
      `w-[calc(33.33%-(16px/3))] shrink-0 p-2 text-center border border-black-200 text-[1.1rem] text-black-base hover:bg-black-100 hover:cursor-pointer font-500`,
    ]),
    loadingIcon: twJoin([
      `flex items-center justify-center h-full text-[4rem] text-black-300 flex-1`,
    ]),
    input: twJoin([
      `flex-1 shrink-0 p-3 bg-black-100 focus:bg-blue-100 outline-none text-black-base text-[1.1rem]`,
    ]),
    addButton: twJoin([
      `bg-blue-500 hover:bg-blue-600 text-white p-2 px-3 text-[1.1rem] font-500`,
    ]),
    cancelButton: twJoin([
      `p-3 bg-red-400 hover:bg-red-500 text-white flex-1 font-500 text-[1.1rem]`,
    ]),
    uploadButton: twJoin([
      `p-3 bg-blue-500 hover:bg-blue-600 text-white flex-1 font-500 text-[1.1rem]`,
    ]),
    tableRow: twJoin([
      `divide-x divide-black-200`,
    ]),
    tableCell: twJoin([
      `p-2 text-center text-[1.1rem] font-500`,
    ]),
    tableCellName: twJoin([
      `p-2 text-center text-[1.1rem] font-900 bg-black-100`,
    ]),
  };

  return (
    <>
      <div className={css.default}>
        {(foldersIsLoading || foldersIsFetching) && (
          <div className={css.loadingIcon}>
            <Icon icon='mingcute:loading-fill' className='animate-spin' />
          </div>
        )}

        {foldersIsSuccess && (
          <>
            <Heading level='h2'>
              선택한 썸네일 정보
            </Heading>

            <table className='border-2 border-black-base'>
              <tbody className='divide-y divide-black-200'>
                <tr className={css.tableRow}>
                  <td className={css.tableCellName}>너비</td>
                  <td className={css.tableCell}>{thumbnail?.width}</td>
                  <td className={css.tableCellName}>높이</td>
                  <td className={css.tableCell}>{thumbnail?.height}</td>
                </tr>
                <tr className={css.tableRow}>
                  <td colSpan={2} className={css.tableCellName}>제목</td>
                  <td colSpan={2} className={css.tableCell}>{thumbnail?.title}</td>
                </tr>
                <tr className={css.tableRow}>
                  <td colSpan={2} className={css.tableCellName}>부제목</td>
                  <td colSpan={2} className={css.tableCell}>{thumbnail?.sub_title}</td>
                </tr>
              </tbody>
            </table>

            <Heading level='h2' styles='!mb-0'>
              발견된 폴더 총 {foldersData.response.files.length}개
            </Heading>
            <div className={css.folders}>
              {foldersData.response.files.map((item) => (
                <div
                  key={Nihil.uuid(0)}
                  data-id={item.id}
                  title={item.name}
                  className={twJoin([
                    css.folderItem,
                    folderId === item.id && 'bg-black-600 text-white border-black-700 hover:bg-black-600',
                  ])}
                  onClick={onClickSelectFolder}
                >
                  {item.name}
                </div>
              ))}
            </div>
            <form
              onSubmit={handleSubmit(onSubmitForm)}
              className='flex flex-row gap-5 w-full'
            >
              <input
                type='text'
                placeholder='새로운 폴더의 이름을 입력하세요'
                {...register('newFolderName')}
                className={css.input}
              />
              <button className={css.addButton}>새폴더 만들기</button>
            </form>
          </>
        )}
        <div className='font-500 text-[1.1rem]'>
          {folderName ? (
            <p>
              선택된 폴더는 <span className='font-900'>{folderName}</span> 입니다.
            </p>
          ) : (
            <p>
              아직 폴더를 선택하지 않았습니다.
            </p>
          )}
        </div>
        <div className='flex flex-row gap-5'>
          <button className={css.uploadButton} onClick={onClickUploadImage}>업로드</button>
          <button className={css.cancelButton} onClick={onClickBack}>뒤로가기</button>
        </div>
      </div>
    </>
  );
}
