'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '@/src/store';
import { ToastContainer } from 'react-toastify';

interface Props {
  children: React.ReactNode;
}

export function Providers({ children, }: Props) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* <SessionProvider> */}
        {children}
        {/* </SessionProvider> */}
        <ToastContainer
          position='bottom-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme='dark'
        />
      </PersistGate>
    </Provider>
  );
}
