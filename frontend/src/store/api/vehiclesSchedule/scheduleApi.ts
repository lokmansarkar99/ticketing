import { fallback } from "@/utils/constants/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

const scheduleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //ADDING SCHEDULE
    addSchedule: builder.mutation({
      query: (data) => ({
        url: "/schedule/create-schedule",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["schedule"],
    }),

    //GETTING ALL SCHEDULES
    getSchedules: builder.query({
      query: (data) => ({
        url: `/schedule/get-schedule-all?search=${data?.search || ""}&size=${
          data?.size || fallback.querySize
        }&page=${data?.page || 1}&sortOrder=${
          data?.sort || fallback.sortOrder
        }`,
      }),
      providesTags: ["schedule"],
    }),

    // GETTING SINGLE SCHEDULE
    getSingleSchedule: builder.query({
      query: (id) => ({
        url: `/schedule/get-schedule-single/${id}`,
      }),
      providesTags: ["schedule"],
    }),

    // UPDATING SCHEDULE
    updateSchedule: builder.mutation({
      query: ({ id, data }) => ({
        url: `/schedule/update-schedule/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["schedule"],
    }),

    // DELETING SCHEDULE
    deleteSchedule: builder.mutation({
      query: (id) => ({
        url: `/schedule/delete-schedule/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["schedule"],
    }),
  }),
});

export const {
  useAddScheduleMutation,
  useDeleteScheduleMutation,
  useGetSchedulesQuery,
  useGetSingleScheduleQuery,
  useUpdateScheduleMutation,
} = scheduleApi;
