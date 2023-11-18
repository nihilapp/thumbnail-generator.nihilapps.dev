import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type Color = {
  red: number;
  green: number;
  blue: number;
}

type State = {
  bgType: ('color' | 'image');
  title: string;
  subTitle: string;
  textColor: Color;
  bgColor: Color;
  imgSrc: string;
  imageY: number;
}

const initialState: State = {
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
};

const appReducer = createSlice({
  name: 'thumbnail',
  initialState,
  reducers: {
    initState(state) {
      state.bgType = 'color';
      state.title = '제목을 입력하세요';
      state.subTitle = '';
      state.textColor = {
        red: 51,
        green: 51,
        blue: 51,
      };
      state.bgColor = {
        red: 255,
        green: 255,
        blue: 255,
      };
      state.imgSrc = '';
      state.imageY = 0;
    },
    setBgType(
      state,
      { payload, }: PayloadAction<('color' | 'image')>
    ) {
      state.bgType = payload;
    },
    setTitle(
      state,
      { payload, }: PayloadAction<string>
    ) {
      state.title = payload;
    },
    setSubTitle(
      state,
      { payload, }: PayloadAction<string>
    ) {
      state.subTitle = payload;
    },
    setTextColor(
      state,
      { payload, }: PayloadAction<Color>
    ) {
      state.textColor = payload;
    },
    setBgColor(
      state,
      { payload, }: PayloadAction<Color>
    ) {
      state.bgColor = payload;
    },
    setImg(
      state,
      { payload, }: PayloadAction<string>
    ) {
      state.imgSrc = payload;
    },
    setY(
      state,
      { payload, }: PayloadAction<number>
    ) {
      state.imageY = payload;
    },
  },
});

export const {
  initState, setBgColor, setBgType, setImg, setSubTitle, setTextColor, setTitle, setY,
} = appReducer.actions;
export default appReducer.reducer;
