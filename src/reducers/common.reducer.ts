import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type ToastType = ('info' | 'success' | 'warning' | 'error' | 'default');

interface InitialState {
  messageType: ToastType;
  message: string;
  messageShown: boolean;
  isSettingSaved: boolean;
  isShowPicker: boolean;
}

const initialState: InitialState = {
  messageType: 'success',
  message: '',
  messageShown: false,
  isSettingSaved: false,
  isShowPicker: false,
};

const commonReducer = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setMessage(
      state,
      { payload, }: PayloadAction<string>
    ) {
      state.message = payload;
    },
    setMessageShown(
      state,
      { payload, }: PayloadAction<boolean>
    ) {
      state.messageShown = payload;
    },
    setIsSettingSaved(
      state,
      { payload, }: PayloadAction<boolean>
    ) {
      state.isSettingSaved = payload;
    },
    setIsShowPicker(
      state,
      { payload, }: PayloadAction<boolean>
    ) {
      state.isShowPicker = payload;
    },
    setMessageType(
      state,
      { payload, }: PayloadAction<ToastType>
    ) {
      state.messageType = payload;
    },
  },
});

export const {
  setMessage,
  setMessageShown,
  setIsSettingSaved,
  setIsShowPicker,
  setMessageType,
} = commonReducer.actions;
export default commonReducer.reducer;
