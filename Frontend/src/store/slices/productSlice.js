import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [
    {
      id: 'PROD-101',
      name: 'Kirloskar 5 HP Solar Submersible Pump Set',
      category: 'Solar Pumps',
      price: 185000,
      stock: 45,
      status: 'Active',
    },
    {
      id: 'PROD-102',
      name: 'Garuda AG-10L Smart Spraying Agriculture Drone',
      category: 'Agri Drones',
      price: 480000,
      stock: 12,
      status: 'Active',
    },
  ],
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.products.unshift(action.payload);
    },
  },
});

export const { addProduct } = productSlice.actions;
export default productSlice.reducer;
