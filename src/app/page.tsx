import React from 'react';
import { Metadata } from 'next';
import { setMeta } from '../hooks/setMeta';
import { HomeDocument } from '../components/Content/Home';
import { configData } from '../data';
import { GoogleDrivePicker } from '../components/Common';

export const metadata: Metadata = setMeta({
  title: `홈 - ${configData.title}`,
  url: '/',
});

export default function IndexPage() {
  return (
    <>
      <HomeDocument />
      <GoogleDrivePicker />
    </>
  );
}
