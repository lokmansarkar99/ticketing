import { fallback } from "@/utils/constants/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

const seatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //ADDING SEAT
    addSeat: builder.mutation({
      query: (data) => ({
        url: "/seat/create-seat",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["seat"],
    }),

    //GETTING ALL SEATS
    getSeats: builder.query({
      query: (data) => ({
        url: `/seat/get-seat-all?search=${data?.search || ""}&size=${
          data?.size || fallback.querySize
        }&page=${data?.page || 1}&sortOrder=${
          data?.sort || fallback.sortOrder
        }`,
      }),
      providesTags: ["seat"],
    }),

    // GETTING SINGLE SEAT
    getSingleSeat: builder.query({
      query: (id) => ({
        url: `/seat/get-seat-single/${id}`,
      }),
      providesTags: ["seat"],
    }),

    // UPDATING SEAT
    updateSeat: builder.mutation({
      query: ({ id, data }) => ({
        url: `/seat/update-seat/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["seat"],
    }),

    // DELETING SEAT
    deleteSeat: builder.mutation({
      query: (id) => ({
        url: `/seat/delete-seat/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["seat"],
    }),
  }),
});

export const {
  useAddSeatMutation,
  useDeleteSeatMutation,
  useGetSeatsQuery,
  useGetSingleSeatQuery,
  useUpdateSeatMutation,
} = seatApi;
