import { configureStore } from '@reduxjs/toolkit';
import { notifyReducer, socketReducer, initSocketReducer, paymentReducer } from './slice';

const store = configureStore({
    reducer: {
      notify: notifyReducer,
      socket: socketReducer,
      initSocket: initSocketReducer,
      payment: paymentReducer
    }
  });
  
  export default store;