import { configureStore } from '@reduxjs/toolkit';
import { notifyReducer, socketReducer, initSocketReducer } from './slice';

const store = configureStore({
    reducer: {
      notify: notifyReducer,
      socket: socketReducer,
      initSocket: initSocketReducer
    }
  });
  
  export default store;