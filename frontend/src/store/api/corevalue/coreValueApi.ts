import { apiSlice } from "../../rootApi/apiSlice";

const coreValueApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADDING CORE VALUE
    addCoreValue: builder.mutation({
      query: (data) => ({
        url: "/core-value/create-core-value",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["coreValue"],
    }),

    // GETTING ALL CORE VALUES
    getCoreValueAllList: builder.query({
      query: () => ({
        url: `/core-value/get-core-value-all`,
      }),
      providesTags: ["coreValue"],
    }),

    // GETTING SINGLE CORE VALUE BY ID
    getSingleCoreValue: builder.query({
      query: (id) => ({
        url: `/core-value/get-core-value-single/${id}`,
      }),
      providesTags: ["coreValue"],
    }),

    // UPDATING CORE VALUE
    updateCoreValue: builder.mutation({
      query: ({ id, data }) => ({
        url: `/core-value/update-core-value/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["coreValue"],
    }),

    // DELETING CORE VALUE
    deleteCoreValue: builder.mutation({
      query: (id) => ({
        url: `/core-value/delete-core-value/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["coreValue"],
    }),
  }),
});

export const {
  useAddCoreValueMutation,
  useGetCoreValueAllListQuery,
  useGetSingleCoreValueQuery,
  useUpdateCoreValueMutation,
  useDeleteCoreValueMutation,
} = coreValueApi;
