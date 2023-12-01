'use client';

import { Nihil } from '@/src/utils/nihil';
import { supabase } from '@/src/utils/supabase/client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { ClassNameValue, twJoin } from 'tailwind-merge';

interface Props {
  styles?: ClassNameValue;
}

export function MyThumbnails({ styles, }: Props) {
  const [ thumbnails, setThumbnails, ] = useState([]);

  useEffect(() => {
    const getThmubnails = async () => {
      const thumbnails = await supabase.from('thumbnails').select();

      console.log(thumbnails.data);
      setThumbnails(thumbnails.data);
    };

    getThmubnails();
  }, []);

  const style = {
    default: twJoin([
      ``,
      styles,
    ]),
  };

  return (
    <>
      <div>
        {thumbnails.map((thumbnail) => (
          <div key={Nihil.uuid(0)}>
            <Image
              src={thumbnail.imageLink}
              alt={thumbnail.title}
              width={1280}
              height={720}
              className='w-[300px] h-auto'
              priority
            />
          </div>
        ))}
      </div>
    </>
  );
}
