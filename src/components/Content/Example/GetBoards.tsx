'use client';

import React from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { useGetBoardsQuery } from '@/src/apis/example.api';
import { Nihil } from '@/src/utils/nihil';

interface Props {
  styles?: ClassNameValue;
}

export function GetBoards({ styles, }: Props) {
  const { data: boards, isSuccess, } = useGetBoardsQuery(null, {
    pollingInterval: 600 * 1000,
  });

  if (isSuccess) {
    console.log(boards);
  }

  const style = {
    default: twJoin([
      ``,
      styles,
    ]),
    title: twJoin([
      `text-h2 font-900 text-black-base`,
    ]),
    content: twJoin([
      `text-black-base`,
    ]),
  };

  return (
    <>
      <div>
        {isSuccess && boards.map((item) => (
          <div key={Nihil.uuid(item.id)}>
            <h2 className={style.title}>{item.title}</h2>
            <p className={style.content}>{item.content}</p>
          </div>
        ))}
      </div>
    </>
  );
}
