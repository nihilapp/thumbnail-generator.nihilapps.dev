'use client';

import { useCreateFolderMutation, useGetFoldersQuery, useUploadImageMutation } from '@/src/apis/drive.api';
import { useAppDispatch, useAppSelector } from '@/src/hooks/rtk';
import { setIsShowPicker } from '@/src/reducers';
import { Nihil } from '@/src/utils/nihil';
import { supabase } from '@/src/utils/supabase/client';
import { Icon } from '@iconify/react';
import React, {
  MouseEvent, useCallback, useState
} from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ClassNameValue, twJoin } from 'tailwind-merge';

interface Props {
  styles?: ClassNameValue;
}

interface Inputs {
  newFolderName: string;
}

// TODO: 드라이브의 가장 최상위 폴더들을 리스팅하고 그 중에서 폴더를 선택하거나 새로운 폴더를 만들 수 있는 기능까지는 지원할 수 있는 간단한 뷰를 제공하는 것은 가능할 것으로 보임. 폴더 내부의 내부의 폴더 같은 경우는 굳이 넣을 필요도 없고 귀찮으므로 생략. picker의 방식은 모달로. 사실상 모달 위에 모달을 띄우는 격.

// TODO: 이 picker를 이용해서 폴더를 선택하면 그 폴더 정보를 리덕스에 저장하고 이미지를 그 폴더에 업로드 하는 과정을 보여주고, picker가 닫히게끔 구현하자.
export function GoogleDrivePicker({ styles, }: Props) {
  const [ folderId, setFolderId, ] = useState('');
  const [ folderName, setFolderName, ] = useState('');

  const { title, imageFileSrc, } = useAppSelector(
    (state) => state.thumbnail
  );

  console.log(imageFileSrc);

  const { session, } = useAppSelector(
    (state) => state.auth
  );

  const {
    data: folders, isSuccess, isLoading, isFetching,
  } = useGetFoldersQuery(null, {
    pollingInterval: 600 * 1000,
  });

  const { register, handleSubmit, } = useForm<Inputs>({
    mode: 'all',
  });

  const [ createFolder, createResult, ] = useCreateFolderMutation();
  const [ uploadImage, uploadResult, ] = useUploadImageMutation();

  const dispatch = useAppDispatch();

  const onSubmitForm: SubmitHandler<Inputs> = useCallback(
    (data) => {
      createFolder({
        folderName: data.newFolderName,
      });
    },
    []
  );

  const onClickHidePicker = useCallback(
    () => {
      dispatch(setIsShowPicker(false));
    },
    []
  );

  const onClickSelectFolder = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const { id, } = event.currentTarget.dataset;
      console.log('folders >> ', folders);

      const folder = folders.files.find((item) => item.id === id);

      setFolderId(id);
      setFolderName(folder.name);
    },
    [ folders, ]
  );

  const onClickUploadImage = useCallback(
    async () => {
      const file = new File([ imageFileSrc, ], 'image.png', {
        type: 'image/png',
      });

      console.log(file);
      const { data: { user, }, } = await supabase.auth.getUser();

      const folder = user.id;
      const nowDate = Nihil.date().format();

      supabase.storage.from('thumbnails').upload(
        `${folder}/${nowDate}.png`,
        file,
        {
          contentType: 'image/png',
        }
      ).then(async (response) => {
        uploadImage({
          folderId,
          imageFile: response.data.path,
          imageName: title,
        }).then((uploadResponse) => {
          console.log(uploadResponse);
        });
      });
    },
    [ folderId, title, imageFileSrc, ]
  );

  const style = {
    default: twJoin([
      'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] bg-white z-50 overflow-y-scroll p-2 flex flex-col gap-2',
      styles,
    ]),
    folders: twJoin([
      'flex flex-row flex-wrap flex-1 content-start gap-[1%]',
    ]),
    folderItem: twJoin([
      'cursor-pointer p-2 border border-black-200 shadow-md shadow-black-300 whitespace-nowrap break-all text-ellipsis overflow-hidden w-[19.2%]',
    ]),
    loadingIcon: twJoin([
      'flex items-center justify-center h-full text-[4rem] text-black-300 flex-1',
    ]),
    h2: twJoin([
      'text-h2 font-900 text-black-base',
    ]),
    input: twJoin([
      'flex-1 shrink-0 p-2 bg-black-100 focus:bg-blue-100 outline-none text-black-base',
    ]),
    addButton: twJoin([
      'bg-blue-500 hover:bg-blue-600 text-white p-2',
    ]),
    cancelButton: twJoin([
      `p-2 bg-red-400 hover:bg-red-500 text-white flex-1`,
    ]),
    uploadButton: twJoin([
      `p-2 bg-blue-500 hover:bg-blue-600 text-white flex-1`,
    ]),
  };

  return (
    <>
      <div className={style.default}>
        <h2 className={style.h2}>
          {(isLoading || isFetching) && (
            <>가져오는 중...</>
          )}
          {isSuccess && (
            <>발견된 폴더 총 {folders.files.length}개</>
          )}
        </h2>
        {(isLoading || isFetching) && (
          <div className={style.loadingIcon}>
            <Icon icon='mingcute:loading-fill' className='animate-spin' />
          </div>
        )}
        {isSuccess && (
          <>
            <div className={style.folders}>
              {folders.files.map((item) => (
                <div
                  key={Nihil.uuid(0)}
                  data-id={item.id}
                  title={item.name}
                  className={twJoin([
                    style.folderItem,
                    folderId === item.id && 'bg-black-600 text-white border-black-700',
                  ])}
                  onClick={onClickSelectFolder}
                >
                  {item.name}
                </div>
              ))}
            </div>
            <form
              onSubmit={handleSubmit(onSubmitForm)}
              className='flex flex-row gap-2 w-full mb-2'
            >
              <input
                type='text'
                placeholder='새로운 폴더의 이름을 입력하세요'
                {...register('newFolderName')}
                className={style.input}
              />
              <button className={style.addButton}>새폴더 만들기</button>
            </form>
          </>
        )}
        <div>
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
        <div className='flex flex-row gap-2'>
          <button className={style.uploadButton} onClick={onClickUploadImage}>업로드</button>
          <button className={style.cancelButton} onClick={onClickHidePicker}>닫기</button>
        </div>
      </div>
    </>
  );
}
