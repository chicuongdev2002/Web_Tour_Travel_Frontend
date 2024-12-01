import { createSlice } from "@reduxjs/toolkit";

const notifySlice = createSlice({
  name: "notify",
  initialState: [
    {
      user: {},
      messages: [],
    },
  ],
  reducers: {
    saveNotify: (state, action) => {
      Object.assign(state, action.payload);
    },
    addNotify: (state, action) => {
      let index = state.findIndex(
        (i) => i.user.userId === action.payload.user.userId,
      );
      if (index === -1) {
        state.unshift(action.payload);
      } else {
        state[index].messages = [
          action.payload.message,
          ...state[index].messages,
        ];
      }
    },
  },
});

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    type: "",
    content: {},
  },
  reducers: {
    addNotification: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
});

const initSocket = createSlice({
  name: "initSocket",
  initialState: false,
  reducers: {
    changeConnectSocket: (state, action) => {
      return action.payload;
    },
  },
});

const paymentSlice = createSlice({
    name: 'payment',
    initialState: {
        bookingId: '',
        userId: '',
        departureId: '',
    },
    reducers: {
        savePayment: (state, action) => {
            Object.assign(state, action.payload);
        }
    }
})

export const { saveNotify, addNotify } = notifySlice.actions;
export const { addNotification } = socketSlice.actions;
export const { changeConnectSocket } = initSocket.actions;
export const { savePayment } = paymentSlice.actions;
export const notifyReducer = notifySlice.reducer;
export const socketReducer = socketSlice.reducer;
export const initSocketReducer = initSocket.reducer;
export const paymentReducer = paymentSlice.reducer;
