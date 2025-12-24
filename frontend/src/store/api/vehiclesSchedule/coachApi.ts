import { fallback } from "@/utils/constants/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

const coachApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //ADDING COACH
    addCoach: builder.mutation({
      query: (data) => ({
        url: "/coach/create-coach",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["coach"],
    }),

    //GETTING ALL COACH
    getCoaches: builder.query({
      query: (data) => {
        const params = new URLSearchParams({
          search: data?.search || "",
          size: data?.size || fallback.querySize,
          page: data?.page || 1,
          sortOrder: data?.sort || fallback.sortOrder,
          coachNo: data?.coachNo || "",
          routeId: data?.routeId || "",
          fromCounterId: data?.fromCounterId || "",
          destinationCounterId: data?.destinationCounterId || "",
          seatPlanId: data?.seatPlanId || "",
          schedule: data?.schedule || "",
          status: data?.status || "",
        });

        return {
          url: `/coach/get-coach-all?${params.toString()}`,
        };
      },
      providesTags: ["coach"],
    }),

    // GETTING SINGLE COACH
    getSingleCoach: builder.query({
      query: (id) => ({
        url: `/coach/get-coach-single/${id}`,
      }),
      providesTags: ["coach"],
    }),

    // UPDATING COACH
    updateCoach: builder.mutation({
      query: ({ id, data }) => ({
        url: `/coach/update-coach/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["coach"],
    }),

    // DELETING COACH
    deleteCoach: builder.mutation({
      query: (id) => ({
        url: `/coach/delete-coach-single/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["coach"],
    }),
    updateCoachActive: builder.mutation({
      query: ({ id, data }) => ({
        url: `/coach/update-coach-active/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["coach"],
    }),
  }),
});

export const {
  useAddCoachMutation,
  useDeleteCoachMutation,
  useGetSingleCoachQuery,
  useGetCoachesQuery,
  useUpdateCoachMutation,
  useUpdateCoachActiveMutation,
} = coachApi;
