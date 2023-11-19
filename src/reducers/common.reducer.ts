import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface InitialState {
  message: string;
  messageShown: boolean;
}

const initialState: InitialState = {
  message: '',
  messageShown: false,
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
  },
});

export const { setMessage, setMessageShown, } = commonReducer.actions;
export default commonReducer.reducer;
