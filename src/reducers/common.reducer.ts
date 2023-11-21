import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface InitialState {
  message: string;
  messageShown: boolean;
  isSettingSaved: boolean;
  isShowPicker: boolean;
}

const initialState: InitialState = {
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
  },
});

export const {
  setMessage, setMessageShown, setIsSettingSaved, setIsShowPicker,
} = commonReducer.actions;
export default commonReducer.reducer;
