import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import equipmentReducer from './slices/equipmentSlice';
import bookingReducer from './slices/bookingSlice';
import communityReducer from './slices/communitySlice';
import notificationReducer from './slices/notificationSlice';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    equipment: equipmentReducer,
    booking: bookingReducer,
    community: communityReducer,
    notification: notificationReducer,
    products: productReducer,
    cart: cartReducer,
  },
});
