import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  equipments: [],
  wishlist: [],
  searchQuery: '',
  selectedCategory: 'All',
  selectedLocation: 'All',
  selectedType: 'All',
  selectedCondition: 'All',
  priceRange: [0, 5000000],
  sortBy: 'featured',
  selectedEquipment: null,
};

const equipmentSlice = createSlice({
  name: 'equipment',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    setSelectedType: (state, action) => {
      state.selectedType = action.payload;
    },
    setSelectedCondition: (state, action) => {
      state.selectedCondition = action.payload;
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    toggleWishlist: (state, action) => {
      const eqId = action.payload.id ?? action.payload;
      if (state.wishlist.includes(eqId)) {
        state.wishlist = state.wishlist.filter(id => id !== eqId);
      } else {
        state.wishlist.push(eqId);
      }
    },
    addEquipment: (state, action) => {
      state.equipments.unshift(action.payload);
    },
    setEquipments: (state, action) => {
      state.equipments = action.payload;
    },
    setWishlist: (state, action) => {
      state.wishlist = action.payload;
    },
    clearWishlist: (state) => {
      state.wishlist = [];
    },
    setSelectedEquipment: (state, action) => {
      state.selectedEquipment = action.payload;
    }
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  setSelectedLocation,
  setSelectedType,
  setSelectedCondition,
  setPriceRange,
  setSortBy,
  toggleWishlist,
  addEquipment,
  setEquipments,
  setSelectedEquipment,
  setWishlist,
  clearWishlist
} = equipmentSlice.actions;

export default equipmentSlice.reducer;
