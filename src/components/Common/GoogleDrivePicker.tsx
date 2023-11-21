'use client';

import { useGetFoldersQuery } from '@/src/apis/drive.api';
import { useAppDispatch } from '@/src/hooks/rtk';
import { setIsShowPicker } from '@/src/reducers';
import { Nihil } from '@/src/utils/nihil';
import { Icon } from '@iconify/react';
import axios from 'axios';
import React, {
  MouseEvent, useCallback, useEffect, useMemo, useState
} from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';

interface Props {
  styles?: ClassNameValue;
}

// TODO: 드라이브의 가장 최상위 폴더들을 리스팅하고 그 중에서 폴더를 선택하거나 새로운 폴더를 만들 수 있는 기능까지는 지원할 수 있는 간단한 뷰를 제공하는 것은 가능할 것으로 보임. 폴더 내부의 내부의 폴더 같은 경우는 굳이 넣을 필요도 없고 귀찮으므로 생략. picker의 방식은 모달로. 사실상 모달 위에 모달을 띄우는 격.

// TODO: 이 picker를 이용해서 폴더를 선택하면 그 폴더 정보를 리덕스에 저장하고 이미지를 그 폴더에 업로드 하는 과정을 보여주고, picker가 닫히게끔 구현하자.
export function GoogleDrivePicker({ styles, }: Props) {
  const [ folderId, setFolderId, ] = useState('');
  const [ folderName, setFolderName, ] = useState('');
  const {
    data: folders, isSuccess, isLoading, isFetching, isError, error,
  } = useGetFoldersQuery(null, {
    pollingInterval: 600 * 1000,
  });

  const dispatch = useAppDispatch();

  const onClickCreateFolder = useCallback(
    async () => {
      const { data, } = await axios.post('/api/drive/folders', {
        fileName: '새로운 폴더를 만들어요.',
      });

      console.log(data);
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

      const folder = folders.files.find((item) => item.id === id);

      setFolderId(id);
      setFolderName(folder.name);
    },
    []
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
  };

  // if (isError) {
  //   return (
  //     <div className={style.default}>

  //     </div>
  //   );
  // }

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
        )}
        <div>
          {folderName && (
            <p>선택한 폴더는 {folderName} 입니다.</p>
          )}
        </div>
        <div className='flex flex-row gap-2'>
          <button className='p-2 bg-blue-500 hover:bg-blue-700 text-white flex-1'>업로드</button>
          <button className='p-2 bg-red-400 hover:bg-red-500 text-white flex-1' onClick={onClickHidePicker}>닫기</button>
        </div>
      </div>
    </>
  );
}
