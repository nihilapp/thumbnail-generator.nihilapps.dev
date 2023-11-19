import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface InitialState {
  message: string;
  messageShown: boolean;
  isSettingSaved: boolean;
}

const initialState: InitialState = {
  message: '',
  messageShown: false,
  isSettingSaved: false,
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
  },
});

export const { setMessage, setMessageShown, setIsSettingSaved, } = commonReducer.actions;
export default commonReducer.reducer;
