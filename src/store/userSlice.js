import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { aluno: null, loggedIn: false },
  reducers: {
    loginAluno: (state, action) => {
      state.aluno = action.payload;
      state.loggedIn = true;
    },
    logoutAluno: (state) => {
      state.aluno = null;
      state.loggedIn = false;
    },
  },
});

export const { loginAluno, logoutAluno } = userSlice.actions;
export default userSlice.reducer;
