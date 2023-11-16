import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { User } from '@supabase/supabase-js';

interface InitialState {
  user: User;
}

const initialState: InitialState = {
  user: null,
};

const authReducer = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(
      state,
      { payload, }: PayloadAction<User>
    ) {
      state.user = payload;
    },
  },
});

export const { setUser, } = authReducer.actions;
export default authReducer.reducer;
