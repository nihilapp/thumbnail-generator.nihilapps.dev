import React from 'react';
import { Metadata } from 'next';
import { Providers } from '../layouts/Providers';
import { configData } from '../data';
import { FooterBlock, HeaderBlock, MainBlock } from '../components/Layout';

import '@/src/styles/tailwind.css';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  metadataBase: new URL(configData.url),
  title: {
    default: `home - ${configData.title}`,
    template: `%s - ${configData.title}`,
  },
  description: configData.description,
  keywords: configData.keywords,
  authors: {
    name: configData.author.name,
    url: configData.author.url,
  },
  generator: 'MS Visual Studio Code',
  openGraph: {
    title: 'home',
    description: configData.description,
    locale: 'ko_KR',
    type: 'website',
    siteName: configData.title,
    url: configData.url,
  },
  alternates: {
    canonical: configData.url,
  },
};

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({ children, }: Props) {
  return (
    <html lang='ko'>
      <body>
        <Providers>
          <HeaderBlock />
          <MainBlock>
            {children}
          </MainBlock>
          <FooterBlock />
        </Providers>
      </body>
    </html>
  );
}
