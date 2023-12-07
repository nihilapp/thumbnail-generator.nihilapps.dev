import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ToastType = ('info' | 'success' | 'warning' | 'error' | 'default');

interface AuthState {
  messageType: ToastType;
  message: string;
  messageShown: boolean;
  isSettingSaved: boolean;
  isShowPicker: boolean;
}

export const commonStore = create(
  persist<AuthState>(() => ({
    messageType: 'success',
    message: '',
    messageShown: false,
    isSettingSaved: false,
    isShowPicker: false,
  }), {
    name: 'state/common',
    skipHydration: true,
    onRehydrateStorage(state) {
      console.log('state >> ', state);
    },
  })
);

export const setMessage = (value: string) => {
  commonStore.setState({ message: value, });
};

export const setMessageShown = (value: boolean) => {
  commonStore.setState({ messageShown: value, });
};

export const setIsSettingSaved = (value: boolean) => {
  commonStore.setState({ isSettingSaved: value, });
};

export const setIsShowPicker = (value: boolean) => {
  commonStore.setState({ isShowPicker: value, });
};

export const setMessageType = (value: ToastType) => {
  commonStore.setState({ messageType: value, });
};
