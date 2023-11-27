import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Session, User } from '@supabase/supabase-js';

type ProviderType = ('EMAIL' | 'GOOGLE' | 'GITHUB' | 'NAVER' | 'KAKAO' | '');

interface InitialState {
  user: User;
  session: Session;
  provider: ProviderType;
}

const initialState: InitialState = {
  user: null,
  session: null,
  provider: '',
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
    setProvider(
      state,
      { payload, }: PayloadAction<ProviderType>
    ) {
      state.provider = payload;
    },
  },
});

export const { setUser, setSession, setProvider, } = authReducer.actions;
export default authReducer.reducer;
