import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Session, User } from '@supabase/supabase-js';

interface InitialState {
  user: User;
  session: Session;
}

const initialState: InitialState = {
  user: null,
  session: null,
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
    setSession(
      state,
      { payload, }: PayloadAction<Session>
    ) {
      state.session = payload;
    },
  },
});

export const { setUser, setSession, } = authReducer.actions;
export default authReducer.reducer;
