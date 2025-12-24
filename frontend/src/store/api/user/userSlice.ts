import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string | null;
  email: string | null;
  role: string | null;
  address: string | null;
  name: string | null;
  counterId?: number | null;
}

const initialState: UserState = {
  id: null,
  email: null,
  role: null,
  address: null,
  name: null,
  counterId: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state: UserState, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.role = action.payload.role;
      state.email = action.payload.email;
      state.address = action.payload.address;
      state.name = action.payload.name;
      state.counterId = action.payload.counterId;
    },
    clearUser: (state: UserState) => {
      state.id = null;
      state.role = null;
      state.email = null;
      state.name = null;
      state.address = null;
      state.counterId = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
