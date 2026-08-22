import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  bookings: [],
  currentBookingDraft: null,
  loading: false,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookingDraft: (state, action) => {
      state.currentBookingDraft = action.payload;
    },
    clearBookingDraft: (state) => {
      state.currentBookingDraft = null;
    },
    createBooking: (state, action) => {
      state.bookings.unshift(action.payload);
      state.currentBookingDraft = null;
    },
    setBookings: (state, action) => {
      state.bookings = action.payload;
    },
    updateBookingStatus: (state, action) => {
      const { bookingId, status, paymentStatus, transactionId } = action.payload;
      const booking = state.bookings.find(b => b.id === bookingId);
      if (booking) {
        if (status) booking.status = status;
        if (paymentStatus) booking.paymentStatus = paymentStatus;
        if (transactionId) booking.transactionId = transactionId;
      }
    }
  },
});

export const { setBookingDraft, clearBookingDraft, createBooking, setBookings, updateBookingStatus } = bookingSlice.actions;
export default bookingSlice.reducer;
