import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TextColor {
  textRed: string;
  textGreen: string;
  textBlue: string;
}

export const textColorStore = create(
  persist<TextColor>(() => ({
    textRed: '51',
    textGreen: '51',
    textBlue: '51',
  }), {
    name: 'state/textColor',
  })
);

export const setTextRed = (value: string) => {
  textColorStore.setState({

  });
};
