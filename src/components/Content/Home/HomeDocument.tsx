'use client';

import React, { useEffect } from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { useAppDispatch, useAppSelector } from '@/src/hooks/rtk';
import { setMessage, setMessageShown } from '@/src/reducers';
import { toast } from 'react-toastify';
import { Heading, TextBlock } from '@/src/components/Base';
import { NoIcon, OkIcon } from '../../Common';

interface Props {
  styles?: ClassNameValue;
}

export function HomeDocument({ styles, }: Props) {
  const { message, messageShown, messageType, } = useAppSelector(
    (state) => state.common
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (message && !messageShown) {
      toast(message, {
        type: messageType,
      });
      dispatch(setMessage(''));
      dispatch(setMessageShown(true));
    }
  }, [ message, messageShown, ]);

  const css = {
    default: twJoin([
      ``,
      styles,
    ]),
  };

  return (
    <>
      <div className={css.default}>
        <Heading level='h2' no={1}>썸네일 생성기</Heading>
        <TextBlock>
          썸네일 생성기는 말 그대로 썸네일을 생성하는 프로그램입니다. 포토샵만큼은 못하겠지만 간단한 썸네일 정도는 만들 수 있게끔 제공하려고 합니다. 썸네일 생성기는 PC 화면에 특화되어 있습니다. 기능의 특성상 모바일은 지원하지 않는 점 참고하시길 바랍니다. 하지만 추후 업데이트를 통해서 모바일에서도 썸네일을 생성할 수 있도록 제공할 예정입니다.
        </TextBlock>
        <TextBlock styles='mb-4'>
          썸네일 생성기는 원하는 텍스트와 원하는 배경 색상, 혹은 이미지를 선택해서 이미지화 하고 파일을 제공하는 과정을 통해 썸네일을 생성합니다. 현재는 생성할 수 있는 썸네일의 사이즈가 1280*720으로 고정되어있습니다. 이 역시 업데이트를 통해서 자유롭게 설정할 수 있도록 개선할 예정입니다.
        </TextBlock>

        <Heading level='h2' no={2}>사용방법</Heading>
        <TextBlock styles='mb-4'>
          썸네일 생성기는 아래의 방법으로 이용가능 하십니다.
        </TextBlock>

        <Heading level='h3' no={2.1}>회원과 비회원에 따른 기능 분리</Heading>
        <TextBlock styles='mb-4'>
          썸네일 생성기는 비회원도 이용할 수 있습니다. 단 기능상의 차이가 존재합니다. 비회원의 경우 썸네일을 생성만 할 수 있으며 설정이 저장되지 않습니다. 회원의 경우 썸네일을 생성하면서 설정까지 같이 저장합니다. 마이페이지의 썸네일 관리 섹션에서 썸네일들을 관리할 수 있도록 기능을 제공하고 있습니다. 차이는 아래의 표를 참고해주세요.
        </TextBlock>
        <TextBlock styles='mb-4'>
          회원가입은 이메일 회원가입, 구글, 깃허브 회원가입을 지원합니다. 카카오, 네이버도 추후에 지원할 생각입니다.
        </TextBlock>

        <table className='w-full border-2 border-black-700 mb-4'>
          <caption className='text-h6 mb-2 font-900 text-black-base'>
            회원가입유무에 따른 기능 차이
          </caption>

          <thead className='border-b border-black-200'>
            <tr className='divide-x divide-black-200'>
              <th aria-label='empty' className='w-1/3 p-2' />
              <th className='w-1/3 p-2'>회원</th>
              <th className='w-1/3 p-2'>비회원</th>
            </tr>
          </thead>

          <tbody className='divide-y divide-black-200'>
            <tr className='divide-x divide-black-200'>
              <th scope='row' className='p-2'>이미지 저장</th>
              <td aria-label='ok' className='p-2'>
                <OkIcon styles='mx-auto' />
              </td>
              <td aria-label='ok' className='p-2'>
                <OkIcon styles='mx-auto' />
              </td>
            </tr>
            <tr className='divide-x divide-black-200'>
              <th scope='row' className='p-2'>구글드라이브 연동</th>
              <td aria-label='ok' className='p-2'>
                <OkIcon styles='mx-auto' />
              </td>
              <td aria-label='no' className='p-2'>
                <NoIcon styles='mx-auto' />
              </td>
            </tr>
            <tr className='divide-x divide-black-200'>
              <th scope='row' className='p-2'>DB 연동</th>
              <td aria-label='ok' className='p-2'>
                <OkIcon styles='mx-auto' />
              </td>
              <td aria-label='no' className='p-2'>
                <NoIcon styles='mx-auto' />
              </td>
            </tr>
          </tbody>
        </table>

        <Heading level='h3' no={2.2}>썸네일 설정 수정, 삭제</Heading>
        <TextBlock>
          상단 메뉴에서 생성 페이지로 넘어가면 썸네일을 생성할 수 있습니다. 원하는 제목, 부제목을 입력하고 텍스트 색상을 설정한 뒤에 배경을 선택하면 됩니다.
        </TextBlock>
        <TextBlock styles='mb-4'>
          그 후에 이미지로 저장 버튼을 클릭하면 이미지가 생성됩니다. 이미지 생성에는 다소 시간이 소요될 수 있습니다. 썸네일이 생성되면서 설정도 함께 저장이 되며 마이 페이지에서 확인이 가능합니다. 어떤 썸네일인지 미리보기 이미지도 함께 제공됩니다.
        </TextBlock>

        <Heading level='h3' no={2.3}>구글 드라이브에 저장</Heading>
        <TextBlock>
          썸네일이 생성되면서 구글 드라이브에도 함께 저장할 수 있는 기능도 제공합니다. 다만 구글로 로그인한 회원에 한해서만 제공이 되며 이 기능을 이용하기 위해서는 구글 로그인으로 전환해서 진행해야 합니다.
        </TextBlock>
      </div>
    </>
  );
}
