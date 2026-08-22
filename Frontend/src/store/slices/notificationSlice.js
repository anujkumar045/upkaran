import { createSlice } from '@reduxjs/toolkit';
import { MOCK_NOTIFICATIONS } from '../../constants/mockData';

const initialState = {
  notifications: MOCK_NOTIFICATIONS,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    markAsRead: (state, action) => {
      const item = state.notifications.find(n => n.id === action.payload);
      if (item) item.read = true;
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    }
  },
});

export const { markAsRead, markAllAsRead, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
