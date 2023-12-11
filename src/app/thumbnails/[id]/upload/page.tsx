import React from 'react';
import { setMeta } from '@/src/hooks/setMeta';
import { supabase } from '@/src/utils/supabase/client';
import { GoogleDrivePicker } from '@/src/components/Content/upload';

export async function generateStaticParams() {
  const { data, } = await supabase
    .from('thumbnails').select();

  return data.map((item) => ({
    id: item.id,
  }));
}

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params, }: Props) {
  return setMeta({
    title: `업로드(구글 드라이브)`,
    url: `/thumbnails/${params.id}/upload`,
  });
}

export default function ThumbnailUploadPage({ params, }: Props) {
  return (
    <>
      <GoogleDrivePicker id={params.id} />
    </>
  );
}
