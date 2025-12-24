import { apiSlice } from "../../rootApi/apiSlice";

const sisterConcernApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADDING SISTER CONCERN
    addSisterConcern: builder.mutation({
      query: (data) => ({
        url: "/sister-concern/create-sister-concern",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["sisterConcern"],
    }),

    // GETTING ALL SISTER CONCERNS
    getSisterConcernAllList: builder.query({
      query: () => ({
        url: `/sister-concern/get-sister-concern-all`,
      }),
      providesTags: ["sisterConcern"],
    }),

    // GETTING SINGLE SISTER CONCERN BY ID
    getSingleSisterConcern: builder.query({
      query: (id) => ({
        url: `/sister-concern/get-sister-concern-single/${id}`,
      }),
      providesTags: ["sisterConcern"],
    }),

    // UPDATING SISTER CONCERN
    updateSisterConcern: builder.mutation({
      query: ({ id, data }) => ({
        url: `/sister-concern/update-sister-concern/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["sisterConcern"],
    }),

    // DELETING SISTER CONCERN
    deleteSisterConcern: builder.mutation({
      query: (id) => ({
        url: `/sister-concern/delete-sister-concern/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["sisterConcern"],
    }),
  }),
});

export const {
  useAddSisterConcernMutation,
  useGetSisterConcernAllListQuery,
  useGetSingleSisterConcernQuery,
  useUpdateSisterConcernMutation,
  useDeleteSisterConcernMutation,
} = sisterConcernApi;
