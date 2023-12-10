import { create } from 'zustand';

type ToastType = ('info' | 'success' | 'warning' | 'error' | 'default');

interface AuthState {
  messageType: ToastType;
  message: string;
  messageShown: boolean;
  isSettingSaved: boolean;
  isShowPicker: boolean;
}

export const commonStore = create<AuthState>(
  () => ({
    messageType: 'success',
    message: '',
    messageShown: false,
    isSettingSaved: false,
    isShowPicker: false,
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
