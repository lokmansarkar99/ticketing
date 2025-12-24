import { fallback } from "@/utils/constants/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

const fareApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //ADDING FARE
    addFare: builder.mutation({
      query: (data) => ({
        url: "/fare/create-fare",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["fare"],
    }),

    //GETTING ALL FARES
    getFares: builder.query({
      query: (data) => ({
        url: `/fare/get-fare-all?search=${data?.search || ""}&size=${
          data?.size || fallback.querySize
        }&page=${data?.page || 1}&sortOrder=${
          data?.sort || fallback.sortOrder
        }`,
      }),
      providesTags: ["fare"],
    }),

    // GETTING SINGLE FARE
    getSingleFare: builder.query({
      query: (id) => ({
        url: `/fare/get-fare-single/${id}`,
      }),
      providesTags: ["fare"],
    }),

    // UPDATING FARE
    updateFare: builder.mutation({
      query: ({ id, data }) => ({
        url: `/fare/update-fare/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["fare"],
    }),

    // DELETING FARE
    deleteFare: builder.mutation({
      query: (id) => ({
        url: `/fare/delete-fare/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["fare"],
    }),
  }),
});

export const {
  useAddFareMutation,
  useDeleteFareMutation,
  useGetFaresQuery,
  useGetSingleFareQuery,
  useUpdateFareMutation,
} = fareApi;
