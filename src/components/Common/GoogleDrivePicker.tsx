'use client';

import axios from 'axios';
import React, { useCallback, useEffect } from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';

interface Props {
  styles?: ClassNameValue;
}

// TODO: 드라이브의 가장 최상위 폴더들을 리스팅하고 그 중에서 폴더를 선택하거나 새로운 폴더를 만들 수 있는 기능까지는 지원할 수 있는 간단한 뷰를 제공하는 것은 가능할 것으로 보임. 폴더 내부의 내부의 폴더 같은 경우는 굳이 넣을 필요도 없고 귀찮으므로 생략. picker의 방식은 모달로. 사실상 모달 위에 모달을 띄우는 격.

// TODO: 이 picker를 이용해서 폴더를 선택하면 그 폴더 정보를 리덕스에 저장하고 이미지를 그 폴더에 업로드 하는 과정을 보여주고, picker가 닫히게끔 구현하자.
export function GoogleDrivePicker({ styles, }: Props) {
  useEffect(() => {
    const getFolders = async () => {
      const response = await fetch('/api/drive/folders');
      const data = await response.json();

      console.log(data);
    };

    getFolders();
  }, []);

  const onClickCreateFolder = useCallback(
    async () => {
      const { data, } = await axios.post('/api/drive/folders', {
        fileName: '새로운 폴더를 만들어요.',
      });

      console.log(data);
    },
    []
  );

  const style = {
    default: twJoin([
      ``,
      styles,
    ]),
  };

  return (
    <>
      <button onClick={onClickCreateFolder}>폴더 만들기</button>
    </>
  );
}
