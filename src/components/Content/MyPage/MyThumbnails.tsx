'use client';

import { supabase } from '@/src/utils/supabase/client';
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
      <div>content</div>
    </>
  );
}
