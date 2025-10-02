import { createSlice } from "@reduxjs/toolkit";

const ticketSlice = createSlice({
  name: "tickets",
  initialState: [],
  reducers: {
    setTickets: (_, action) => action.payload,
    addTicket: (state, action) => {
      state.push(action.payload);
    },
    deleteTicket: (state, action) => {
      return state.filter((ticket) => ticket.id !== action.payload);
    },
    resetTickets: () => [],
  },
});

export const { setTickets, addTicket, deleteTicket, resetTickets } = ticketSlice.actions;
export default ticketSlice.reducer;
