import { create } from 'zustand';
import defaultImage from '@/src/images/defaultImage.png';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Color = {
  red: string;
  green: string;
  blue: string;
}

type ThumbnailState = {
  bgType: ('color' | 'image');
  title: string;
  subTitle: string;
  textRed: string;
  textGreen: string;
  textBlue: string;
  bgRed: string;
  bgGreen: string;
  bgBlue: string;
  imgSrc: string;
  imageY: number;
  imageFileSrc: string;
  width: number;
  height: number;
  imagePath: string;
  testInit: () => void;
}

export const thumbnailStore = create(
  persist<ThumbnailState>((setState, getState) => ({
    bgType: 'color',
    title: '제목을 입력하세요',
    subTitle: '',
    textRed: '51',
    textGreen: '51',
    textBlue: '51',
    bgRed: '255',
    bgGreen: '255',
    bgBlue: '255',
    imgSrc: '',
    imageY: 0,
    imageFileSrc: defaultImage.src,
    width: 1280,
    height: 720,
    imagePath: '',
    testInit() {
      console.log('초기화가 왜 안돼냐고 다른건 다 되는데');
      setState({
        bgType: 'color',
        title: '제목을 입력하세요',
        subTitle: '',
        textRed: '51',
        textGreen: '51',
        textBlue: '51',
        bgRed: '255',
        bgGreen: '255',
        bgBlue: '255',
        imgSrc: '',
        imageY: 0,
        imageFileSrc: defaultImage.src,
        width: 1280,
        height: 720,
        imagePath: '',
      });
    },
  }), {
    name: 'state/thumbnails',
    skipHydration: true,
    storage: createJSONStorage(() => localStorage),
  })
);

export const initState = () => {
  thumbnailStore.setState((state) => ({
    ...state,
    bgType: 'color',
    title: '제목을 입력하세요',
    subTitle: '',
    textRed: '51',
    textGreen: '51',
    textBlue: '51',
    bgRed: '255',
    bgGreen: '255',
    bgBlue: '255',
    imgSrc: '',
    imageY: 0,
    imageFileSrc: defaultImage.src,
    width: 1280,
    height: 720,
  }));
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
  console.log('textColor >> ', color);
  thumbnailStore.setState((state) => ({
    ...state,
    textRed: color.red,
    textGreen: color.green,
    textBlue: color.blue,
  }));
};

export const setBgColor = (color: Color) => {
  thumbnailStore.setState((state) => ({
    ...state,
    bgRed: color.red,
    bgGreen: color.green,
    bgBlue: color.blue,
  }));
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

export const setWidth = (width: number) => {
  thumbnailStore.setState({
    width,
  });
};

export const setHeight = (height: number) => {
  thumbnailStore.setState({
    height,
  });
};

export const setImagePath = (value: string) => {
  thumbnailStore.setState({
    imagePath: value,
  });
};
