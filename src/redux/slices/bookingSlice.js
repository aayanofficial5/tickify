import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 1,
  selectedSeats: localStorage.getItem("selectedSeats") || [],
  selectedMovie: JSON.parse(localStorage.getItem("selectedMovie")) || null,
  selectedShowtime:
    JSON.parse(localStorage.getItem("selectedShowTime")) || null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    nextStep: (state) => {
      if (state.step < 3) state.step += 1;
    },
    prevStep: (state) => {
      if (state.step > 1) state.step -= 1;
    },
    setSelectedSeats(state, action) {
      state.selectedSeats = action.payload;
      localStorage.setItem("selectedSeats", JSON.stringify(action.payload));
    },
    setSelectedMovie(state, action) {
      state.selectedMovie = action.payload;
      localStorage.setItem("selectedMovie", JSON.stringify(action.payload));
    },
    setSelectedShowtime(state, action) {
      state.selectedShowtime = action.payload;
      localStorage.setItem("selectedShowTime", JSON.stringify(action.payload));
    },
    resetBooking(state) {
      state.selectedSeats = [];
      state.selectedMovie = null;
      state.selectedShowtime = null;
      localStorage.removeItem("selectedMovie");
      localStorage.removeItem("selectedSeats");
      localStorage.removeItem("selectedShowTime");
    },
  },
});

export const {
  nextStep,
  prevStep,
  setSelectedSeats,
  setSelectedMovie,
  setSelectedShowtime,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
