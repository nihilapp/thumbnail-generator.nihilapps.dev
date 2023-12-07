import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import defaultImage from '@/src/images/defaultImage.png';

export type Color = {
  red: number;
  green: number;
  blue: number;
}

type ThumbnailState = {
  bgType: ('color' | 'image');
  title: string;
  subTitle: string;
  textColor: Color;
  bgColor: Color;
  imgSrc: string;
  imageY: number;
  imageFileSrc: string;
}

export const thumbnailStore = create(
  persist<ThumbnailState>(() => ({
    bgType: 'color',
    title: '제목을 입력하세요',
    subTitle: '',
    textColor: {
      red: 51,
      green: 51,
      blue: 51,
    },
    bgColor: {
      red: 255,
      green: 255,
      blue: 255,
    },
    imgSrc: '',
    imageY: 0,
    imageFileSrc: defaultImage.src,
  }), {
    name: 'state/thumbnails',
    skipHydration: true,
    onRehydrateStorage(state) {
      console.log('state >> ', state);
    },
  })
);

export const initState = () => {
  thumbnailStore.setState({
    bgType: 'color',
    title: '제목을 입력하세요',
    subTitle: '',
    textColor: {
      red: 51,
      green: 51,
      blue: 51,
    },
    bgColor: {
      red: 255,
      green: 255,
      blue: 255,
    },
    imgSrc: '',
    imageY: 0,
    imageFileSrc: defaultImage.src,
  });
};

export const setTitle = (value: string) => {
  thumbnailStore.setState({
    title: value,
  });
};

export const setSubTitle = (value: string) => {
  thumbnailStore.setState({
    subTitle: value,
  });
};

export const setTextColor = (color: Color) => {
  thumbnailStore.setState({
    textColor: color,
  });
};

export const setBgColor = (color: Color) => {
  thumbnailStore.setState({
    bgColor: color,
  });
};

export const setBgType = (value: ('color' | 'image')) => {
  thumbnailStore.setState({
    bgType: value,
  });
};

export const setImg = (value: string) => {
  thumbnailStore.setState({
    imgSrc: value,
  });
};

export const setY = (value: number) => {
  thumbnailStore.setState({
    imageY: value,
  });
};

export const setImageFileSrc = (value: string) => {
  thumbnailStore.setState({
    imageFileSrc: value,
  });
};
