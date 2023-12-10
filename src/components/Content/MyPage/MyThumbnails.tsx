'use client';

import { Nihil } from '@/src/utils/nihil';
import { supabase } from '@/src/utils/supabase/client';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';
import { IThumbnails } from '@/src/types/entity.types';
import { Heading } from '@/src/components/Base';
import { authStore } from '@/src/store/auth.store';
import Link from 'next/link';

interface Props {
  styles?: ClassNameValue;
}

export function MyThumbnails({ styles, }: Props) {
  const [ thumbnails, setThumbnails, ] = useState<IThumbnails[]>([]);

  const { user, } = authStore();
  console.log('user >> ', user);

  useEffect(() => {
    if (user) {
      const getThumbnails = async () => {
        return supabase
          .from('thumbnails')
          .select()
          .eq('user_id', user.id)
          .order('created_at', { ascending: false, });
      };

      getThumbnails().then((thumbnails) => {
        console.log(thumbnails.data);
        setThumbnails(thumbnails.data);
      });
    }
  }, [ user, ]);

  const onClickDelete = useCallback(
    async (id: string, path: string) => {
      console.log(id);

      await supabase
        .from('thumbnails')
        .delete()
        .eq('id', id);

      await supabase.storage
        .from('thumbnails')
        .remove([ path, ]);

      setThumbnails((prevState) => prevState.filter((item) => item.id !== id));
    },
    []
  );

  const css = {
    default: twJoin([
      ``,
      styles,
    ]),
    itemList: twJoin([
      `flex flex-wrap gap-4`,
    ]),
    item: twJoin([
      `w-[calc((100%-32px)/3)] shrink-0 flex flex-col gap-2 p-2 border border-black-200 shadow-black-200 shadow-md`,
    ]),
    itemImage: twJoin([
      `border-2 border-black-400`,
    ]),
    buttons: twJoin([
      `flex flex-row gap-2 items-center`,
    ]),
    manageButton: twJoin([
      `p-2 bg-blue-400 flex-1 text-white hover:bg-blue-600 text-center text-[1.1rem] font-500`,
    ]),
    deleteButton: twJoin([
      `p-2 bg-red-400 flex-1 text-white hover:bg-red-600 text-center text-[1.1rem] font-500`,
    ]),
    noneItem: twJoin([
      `w-full text-center py-[250px] text-[2rem] font-900 text-black-base`,
    ]),
  };

  return (
    <>
      <div className={css.default}>
        <Heading level='h2'>내 썸네일 목록</Heading>

        <div className={css.itemList}>
          {thumbnails.length === 0 ? (
            <h2 className={css.noneItem}>썸네일이 없습니다.</h2>
          ) : (
            ''
          )}
          {thumbnails?.map((thumbnail) => (
            <div key={Nihil.uuid(0)} className={css.item}>
              <Image
                src={thumbnail.image_link}
                alt={thumbnail.title}
                width={1280}
                height={720}
                className={css.itemImage}
                priority
              />
              <div className={css.buttons}>
                <Link
                  href='/thumbnails/[id]'
                  as={`/thumbnails/${thumbnail.id}`}
                  className={css.manageButton}
                >
                  자세히 보기
                </Link>
                <button
                  className={css.deleteButton}
                  onClick={() => onClickDelete(thumbnail.id, thumbnail.image_path)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
