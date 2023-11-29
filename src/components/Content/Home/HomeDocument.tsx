'use client';

import React, { useEffect } from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { useAppDispatch, useAppSelector } from '@/src/hooks/rtk';
import { setMessage, setMessageShown } from '@/src/reducers';
import { toast } from 'react-toastify';
import { Auth } from '@/src/utils/auth';
import { NoIcon, OkIcon } from '../../Common';

interface Props {
  styles?: ClassNameValue;
}

export function HomeDocument({ styles, }: Props) {
  const { message, messageShown, } = useAppSelector(
    (state) => state.common
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (message && !messageShown) {
      toast.success(message);
      dispatch(setMessage(''));
      dispatch(setMessageShown(true));
    }
  }, [ message, messageShown, ]);

  const style = {
    default: twJoin([
      ``,
      styles,
    ]),
  };

  return (
    <>
      <button onClick={() => {
        Auth.expDiff().then((res) => {
          console.log(res);
        });
      }}
      >
        test
      </button>
      <div className={style.default}>
        <h2>썸네일 생성기</h2>
        <p>썸네일 생성기는 말 그대로 썸네일을 생성하는 프로그램입니다. 포토샵만큼은 못하겠지만 간단한 썸네일 정도는 만들 수 있게끔 제공하려고 합니다. 썸네일 생성기는 PC 화면에 특화되어 있습니다. 기능의 특성상 모바일은 지원하지 않는 점 참고하시길 바랍니다.</p>
        <p>썸네일 생성기는 원하는 텍스트와 원하는 배경 색상, 혹은 이미지를 선택해서 이미지화 하고 파일을 제공하는 과정을 통해 썸네일을 생성합니다.</p>

        <h2>간단한 사용방법</h2>
        <p>썸네일 생성기는 아래의 방법대로 사용할 수 있음</p>

        <h3>회원과 비회원에 따른 기능 분리</h3>
        <p>썸네일 생성기는 비회원도 이용할 수 있습니다. 아래는 회원과 비회원의 기능 차이를 나타낸 표입니다. 비회원은 설정을 저장할 수 없지만 회원은 설정이 자동으로 저장되며 저장된 설정을 언제든 불러와서 썸네일을 만들 수 있습니다.</p>
        <p>회원가입은 이메일 회원가입, 구글, 깃허브 회원가입을 지원합니다.</p>

        <table>
          <colgroup>
            <col />
          </colgroup>
          <thead>
            <tr>
              <th aria-label='empty' />
              <th>회원</th>
              <th>비회원</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope='row'>이미지 저장</th>
              <td aria-label='ok'>
                <OkIcon />
              </td>
              <td aria-label='ok'>
                <OkIcon />
              </td>
            </tr>
            <tr>
              <th scope='row'>구글드라이브 연동</th>
              <td aria-label='ok'>
                <OkIcon />
              </td>
              <td aria-label='no'>
                <NoIcon />
              </td>
            </tr>
            <tr>
              <th scope='row'>DB 연동</th>
              <td aria-label='ok'>
                <OkIcon />
              </td>
              <td aria-label='no'>
                <NoIcon />
              </td>
            </tr>
          </tbody>
        </table>

        <h3>썸네일 설정 수정, 삭제, 생성</h3>
        <p>상단 메뉴에서 생성 페이지로 넘어가면 썸네일을 생성할 수 있습니다. 원하는 제목, 부제목을 입력하고 텍스트 색상을 설정한 뒤에 배경을 선택하면 됩니다.</p>
        <p>그 후에 이미지로 저장 버튼을 클릭하면 이미지가 생성됩니다. 이미지 생성에는 다소 시간이 소요될 수 있습니다.</p>
      </div>
    </>
  );
}
