'use client';

import createClient from '@/src/utils/supabase/client';
import React, { useCallback, useEffect, useState } from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';

interface Props {
  styles?: ClassNameValue;
}

export function WordChange({ styles, }: Props) {
  const [ word, setWord, ] = useState('JavaScript');
  const [ supabase, ] = useState(() => createClient());

  useEffect(() => {
    const getSession = async () => {
      const { data, } = await supabase.auth.getSession();

      console.log('로그인 여부 >> ', data);
    };

    getSession();
  }, []);

  const onClickWord = useCallback(
    () => {
      setWord((prev) => (
        prev === 'JavaScript' ? 'TypeScript' : 'JavaScript'
      ));
    },
    []
  );

  const style = {
    default: twJoin([
      ``,
      styles,
    ]),
    word: twJoin([
      `p-2 text-h2 text-white bg-black-600 mb-3 text-center font-900`,
    ]),
    button: twJoin([
      `bg-blue-500 hover:bg-blue-600 text-white p-2 text-h3 block w-full`,
    ]),
  };

  return (
    <div>
      <div className={style.word}>{word}</div>
      <button
        onClick={onClickWord}
        className={style.button}
      >
        클릭해서 변경
      </button>
    </div>
  );
}
