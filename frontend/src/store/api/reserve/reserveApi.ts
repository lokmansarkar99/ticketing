import { fallback } from "@/utils/constants/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

const reserveApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //ADDING RESERVE
    addReserve: builder.mutation({
      query: (data) => ({
        url: "/reserve/create-reserve",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["reserve"],
    }),

    //GETTING ALL RESERVE
    getReserve: builder.query({
      query: (data) => ({
        url: `/reserve/get-reserve-all?search=${data?.search || ""}&size=${
          data?.size || fallback.querySize
        }&page=${data?.page || 1}&sortOrder=${
          data?.sort || fallback.sortOrder
        }`,
      }),
      providesTags: ["reserve"],
    }),

    // GETTING SINGLE RESERVE
    getSingleReserve: builder.query({
      query: (id) => ({
        url: `/reserve/get-reserve-single/${id}`,
      }),
      providesTags: ["reserve"],
    }),

    // UPDATING RESERVE
    updateReserve: builder.mutation({
      query: ({ id, updateData }) => ({
        url: `/reserve/update-reserve/${id}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: ["reserve"],
    }),

    // DELETING RESERVE
    deleteReserve: builder.mutation({
      query: (id) => ({
        url: `/reserve/delete-reserve/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["reserve"],
    }),
  }),
});

export const {
  useAddReserveMutation,
  useDeleteReserveMutation,
  useGetReserveQuery,
  useGetSingleReserveQuery,
  useUpdateReserveMutation
} = reserveApi;
