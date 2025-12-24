import { apiSlice } from "../../rootApi/apiSlice";

const userStatisticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADDING USER STATISTIC
    addUserStatistic: builder.mutation({
      query: (data) => ({
        url: "/user-statics/create-user-statics",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["userStatistics"],
    }),

    // GETTING ALL USER STATISTICS
    getUserStatisticAllList: builder.query({
      query: () => ({
        url: "/user-statics/get-user-statics-all",
      }),
      providesTags: ["userStatistics"],
    }),

    // GETTING SINGLE USER STATISTIC BY ID
    getSingleUserStatistic: builder.query({
      query: (id) => ({
        url: `/user-statics/get-user-statics-single/${id}`,
      }),
      providesTags: ["userStatistics"],
    }),

    // UPDATING USER STATISTIC
    updateUserStatistic: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user-statics/update-user-statics/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["userStatistics"],
    }),

    // DELETING USER STATISTIC
    deleteUserStatistic: builder.mutation({
      query: (id) => ({
        url: `/user-statics/delete-user-statics/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["userStatistics"],
    }),
  }),
});

export const {
  useAddUserStatisticMutation,
  useGetUserStatisticAllListQuery,
  useGetSingleUserStatisticQuery,
  useUpdateUserStatisticMutation,
  useDeleteUserStatisticMutation,
} = userStatisticsApi;
