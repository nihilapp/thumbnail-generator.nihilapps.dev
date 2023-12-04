'use client';

import React, { useEffect, useState } from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { supabase } from '@/src/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/src/hooks/rtk';
import { setMessage, setMessageShown, setMessageType } from '@/src/reducers';

interface Props {
  id: string;
  styles?: ClassNameValue;
}

export function ThumbnailData({ id, styles, }: Props) {
  const [ thumbnail, setThumbnail, ] = useState(null);

  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const getThumbnailById = async () => {
      try {
        const { data: [ thumbnail, ], } = await supabase
          .from('thumbnails').select().eq('id', id);

        setThumbnail(thumbnail);
      } catch (error) {
        dispatch(setMessageType('error'));
        dispatch(setMessage(error.message));
        dispatch(setMessageShown(false));

        router.push('/');
      }
    };

    getThumbnailById();
  }, []);

  const css = {
    default: twJoin([
      ``,
      styles,
    ]),
  };

  return (
    <>
      <div className={css.default}>
        <div>{thumbnail?.title}</div>
        <div>{thumbnail?.user_id}</div>
      </div>
    </>
  );
}