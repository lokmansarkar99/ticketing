import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { format } from "date-fns";

export interface ITickitBookingStateProps {
  calenderOpen: boolean;
  fromStationId: number | null;
  toStationId: number | null;
  counterId: number | null;
  userId: number | null;
  coachType: string;
  coachNo:string | null;
  schedule:string | null;
  date: string | null;
  returnDate: string | null;
  orderType: "One_Trip" | "Round_Trip";
  bookingCoachesList: any[];
  roundTripGobookingCoachesList: any[]; // Added for round trip go data
  roundTripReturnBookingCoachesList: any[]; // Added for round trip return data
  isLoadingBookingCoachesList: boolean;
  isLoadingRoundTripGoBookingCoachesList: boolean;
  isLoadingRoundTripReturnBookingCoachesList: boolean;
  bookedSeatList:any[],
  // Migration-specific fields
  migrateFromStationId: number | null;
  migrateToStationId: number | null;
  migrateDate: string | null;
  migrateBookedSeatList: any[];
}

const initialState: ITickitBookingStateProps = {
  calenderOpen: false,
  fromStationId: null,
  toStationId: null,
  counterId: null,
  userId: null,
  coachType: "AC",
  coachNo:null,
  schedule:null,
  date: format(new Date(), "yyyy-MM-dd"),
  returnDate: null,
  orderType: "One_Trip",
  bookingCoachesList: [],
  roundTripGobookingCoachesList: [],
  roundTripReturnBookingCoachesList: [],
  isLoadingBookingCoachesList: false,
  isLoadingRoundTripGoBookingCoachesList: false,
  isLoadingRoundTripReturnBookingCoachesList: false,
  bookedSeatList:[],
  migrateFromStationId: null,
  migrateToStationId: null,
  migrateDate: format(new Date(), "yyyy-MM-dd"),
  migrateBookedSeatList: [],
};

const counterSearchFilterSlice = createSlice({
  name: "counterSearchFilter",
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
    setCoachNo(state, action: PayloadAction<string>) {
      state.coachNo = action.payload;
    },
    setSchedule(state, action: PayloadAction<string>) {
      state.schedule = action.payload;
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
    setCounterId(state, action: PayloadAction<number | null>) {
      state.counterId = action.payload;
    },
    setUserId(state, action: PayloadAction<number | null>) {
      state.userId = action.payload;
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
    resetFilters(state) {
      Object.assign(state, initialState);
    },
    // Loading reducers
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
    setMigrateFromStationId(state, action: PayloadAction<number | null>) {
      state.migrateFromStationId = action.payload;
    },
    setMigrateToStationId(state, action: PayloadAction<number | null>) {
      state.migrateToStationId = action.payload;
    },
    setMigrateDate(state, action: PayloadAction<string | null>) {
      state.migrateDate = action.payload;
    },
    setMigrateBookedSeatList(state, action: PayloadAction<any[]>) {
      state.migrateBookedSeatList = action.payload;
    },
  },
});

export const {
  setFromCounterId,
  setDestinationCounterId,
  setCoachType,
  setDate,
  setReturnDate,
  setCounterId,
  setCoachNo,
  setSchedule,
  setUserId,
  setOrderType,
  setBookedSeatList,
  setBookingCoachesList,
  setRoundTripGoBookingCoachesList,
  setRoundTripReturnBookingCoachesList,
  resetFilters,
  setIsLoadingBookingCoachesList,
  setIsLoadingRoundTripGoBookingCoachesList,
  setIsLoadingRoundTripReturnBookingCoachesList,
  setMigrateFromStationId,
  setMigrateToStationId,
  setMigrateDate,
  setMigrateBookedSeatList,
} = counterSearchFilterSlice.actions;

export const selectCounterSearchFilter = (state: any) =>
  state.counterSearchFilter;

export default counterSearchFilterSlice.reducer;
