import { fallback } from "@/utils/constants/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

const seatPlanApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADDING SEAT PLAN
    addSeatPlan: builder.mutation({
      query: (data) => ({
        url: "/seat-plan/create-seat-plan",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["seat-plan"],
    }),

    // GETTING ALL SEAT PLANS
    getSeatPlans: builder.query({
      query: (data) => ({
        url: `/seat-plan/get-seat-plan-all?search=${data?.search || ""}&size=${
          data?.size || fallback.querySize
        }&page=${data?.page || 1}&sortOrder=${
          data?.sort || fallback.sortOrder
        }`,
      }),
      providesTags: ["seat-plan"],
    }),

    // GETTING SINGLE SEAT PLAN
    getSingleSeatPlan: builder.query({
      query: (id) => ({
        url: `/seat-plan/get-seat-plan-single/${id}`,
      }),
      providesTags: ["seat-plan"],
    }),

    // UPDATING SEAT PLAN
    updateSeatPlan: builder.mutation({
      query: ({ id, data }) => ({
        url: `/seat-plan/update-seat-plan/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["seat-plan"],
    }),

    // DELETING SEAT PLAN
    deleteSeatPlan: builder.mutation({
      query: (id) => ({
        url: `/seat-plan/delete-seat-plan/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["seat-plan"],
    }),
  }),
});

export const {
  useAddSeatPlanMutation,
  useDeleteSeatPlanMutation,
  useGetSeatPlansQuery,
  useGetSingleSeatPlanQuery,
  useUpdateSeatPlanMutation,
} = seatPlanApi;