import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { format } from "date-fns";

export interface ITickitBookingStateProps {
  calenderOpen: boolean;
  fromStationId: number | null;
  toStationId: number | null;
  counterId: number | null;
  userId: number | null;
  coachType: string;
  coachNo: string | null;
  schedule: string | null;
  date: string | null;
  returnDate: string | null;
  orderType: "One_Trip" | "Round_Trip";
  bookingCoachesList: any[];
  roundTripGobookingCoachesList: any[]; // Added for round trip go data
  roundTripReturnBookingCoachesList: any[]; // Added for round trip return data
  isLoadingBookingCoachesList: boolean;
  isLoadingRoundTripGoBookingCoachesList: boolean;
  isLoadingRoundTripReturnBookingCoachesList: boolean;
  bookedSeatList: any[];
}

const initialState: ITickitBookingStateProps = {
  calenderOpen: false,
  fromStationId: null,
  toStationId: null,
  counterId: null,
  userId: null,
  coachType: "AC",
  coachNo: null,
  schedule: null,
  date: format(new Date(), "yyyy-MM-dd"),
  returnDate: null,
  orderType: "One_Trip",
  bookingCoachesList: [],
  roundTripGobookingCoachesList: [],
  roundTripReturnBookingCoachesList: [],
  isLoadingBookingCoachesList: false,
  isLoadingRoundTripGoBookingCoachesList: false,
  isLoadingRoundTripReturnBookingCoachesList: false,
  bookedSeatList: [],
};

const callcenterSearchFilterSlice = createSlice({
  name: "callcenterSearchFilter",
  initialState,
  reducers: {
    setFromCounterId(state, action: PayloadAction<number | null>) {
      state.fromStationId = action.payload;
    },
    setDestinationCounterId(state, action: PayloadAction<number | null>) {
      state.toStationId = action.payload;
    },
    setCoachType(state, action: PayloadAction<string>) {
      state.coachType = action.payload;
    },
    setBookedSeatList(state, action: PayloadAction<any[]>) {
      state.bookedSeatList = action.payload;
    },
    setDate(state, action: PayloadAction<string | null>) {
      state.date = action.payload;
    },
    setReturnDate(state, action: PayloadAction<string | null>) {
      state.returnDate = action.payload;
    },
    setOrderType(state, action: PayloadAction<"One_Trip" | "Round_Trip">) {
      state.orderType = action.payload;
    },
    setCoachNo(state, action: PayloadAction<string>) {
      state.coachNo = action.payload;
    },
    setSchedule(state, action: PayloadAction<string>) {
      state.schedule = action.payload;
    },
    setBookingCoachesList(state, action: PayloadAction<any[]>) {
      state.bookingCoachesList = action.payload;
    },
    setRoundTripGoBookingCoachesList(state, action: PayloadAction<any[]>) {
      state.roundTripGobookingCoachesList = action.payload;
    },
    setRoundTripReturnBookingCoachesList(state, action: PayloadAction<any[]>) {
      state.roundTripReturnBookingCoachesList = action.payload;
    },
    setCounterId(state, action: PayloadAction<number | null>) {
      state.counterId = action.payload;
    },
    setUserId(state, action: PayloadAction<number | null>) {
      state.userId = action.payload;
    },
    resetFilters(state) {
      Object.assign(state, initialState);
    },
    setIsLoadingBookingCoachesList(state, action: PayloadAction<boolean>) {
      state.isLoadingBookingCoachesList = action.payload;
    },
    setIsLoadingRoundTripGoBookingCoachesList(
      state,
      action: PayloadAction<boolean>
    ) {
      state.isLoadingRoundTripGoBookingCoachesList = action.payload;
    },
    setIsLoadingRoundTripReturnBookingCoachesList(
      state,
      action: PayloadAction<boolean>
    ) {
      state.isLoadingRoundTripReturnBookingCoachesList = action.payload;
    },
  },
});

export const {
  setFromCounterId,
  setDestinationCounterId,
  setCoachType,
  setDate,
  setReturnDate,
  setOrderType,
  setCoachNo,
  setSchedule,
  setBookedSeatList,
  setBookingCoachesList,
  setRoundTripGoBookingCoachesList,
  setRoundTripReturnBookingCoachesList,
  setCounterId, // ✅ newly added
  setUserId, // ✅ newly added
  resetFilters,
  setIsLoadingBookingCoachesList,
  setIsLoadingRoundTripGoBookingCoachesList,
  setIsLoadingRoundTripReturnBookingCoachesList,
} = callcenterSearchFilterSlice.actions;

export const selectCallcenterSearchFilter = (state: any) =>
  state.callcenterSearchFilter;

export default callcenterSearchFilterSlice.reducer;
