import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { exampleApi } from '../apis/example.api';
import authReducer from '../reducers/auth.reducer';
import thumbnailReducer from '../reducers/thumbnail.reducer';

const createNoopStorage = () => {
  return {
    // eslint-disable-next-line no-unused-vars
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    // eslint-disable-next-line no-unused-vars
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};

const storage = typeof window === 'undefined'
  ? createNoopStorage()
  : createWebStorage('local');

const reducers = combineReducers({
  [exampleApi.reducerPath]: exampleApi.reducer,
  auth: authReducer,
  thumbnail: thumbnailReducer,
});

const persistedReducer = persistReducer({
  key: 'root',
  storage,
  whitelist: [ 'auth', ],
  blacklist: [ 'example', exampleApi.reducerPath, ],
}, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [ FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, ],
      },
    }),
  ].concat(exampleApi.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
