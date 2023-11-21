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
import commonReducer from '../reducers/common.reducer';
import { driveApi } from '../apis/drive.api';

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
  [driveApi.reducerPath]: driveApi.reducer,
  auth: authReducer,
  thumbnail: thumbnailReducer,
  common: commonReducer,
});

const persistedReducer = persistReducer({
  key: 'root',
  storage,
  whitelist: [ 'auth', 'thumbnail', driveApi.reducerPath, ],
  blacklist: [ 'common', exampleApi.reducerPath, ],
}, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [ FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, ],
      },
    }),
  ].concat(
    exampleApi.middleware,
    driveApi.middleware
  ),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
