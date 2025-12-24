// coachConfigModalSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface CoachConfigModalState {
  isModalOpen: boolean;
}

const initialState: CoachConfigModalState = {
  isModalOpen: false,
};

const coachConfigModalSlice = createSlice({
  name: "coachConfigModal",
  initialState,
  reducers: {
    openModal: (state) => {
      state.isModalOpen = true;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
    },
  },
});

export const { openModal, closeModal } = coachConfigModalSlice.actions;
export default coachConfigModalSlice.reducer;
