import { configData } from '../data';
import { IMetaData } from '../types/common.types';

export const setMeta = (meta: IMetaData) => ({
  metadataBase: new URL(configData.url),
  title: {
    default: `${meta.title} - ${configData.title}`,
    template: `%s - ${configData.title}`,
  },
  description: meta.description || configData.description,
  keywords: meta.keywords || configData.keywords,
  authors: {
    name: configData.author.name,
    url: configData.author.url,
  },
  openGraph: {
    title: meta.title,
    description: meta.description || configData.description,
    locale: 'ko_KR',
    type: 'website',
    siteName: configData.title,
    url: meta.url,
  },
  alternates: {
    canonical: meta.url,
  },
});
