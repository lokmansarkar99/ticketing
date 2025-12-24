import { apiSlice } from "../../rootApi/apiSlice";

const contentManagementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADDING CMS
    addCMS: builder.mutation({
      query: (data) => ({
        url: "/cms/create-cms",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["cms"],
    }),

    // GETTING SINGLE CMS BY ID
    getSingleCMS: builder.query({
      query: () => ({
        url: `/cms/get-cms-single`,
      }),
      providesTags: ["cms"],
    }),

    // UPDATING CMS
    updateCMS: builder.mutation({
      query: ({ id, data }) => ({
        url: `/cms/update-cms/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["cms"],
    }),

    // DELETING CMS
    deleteCMS: builder.mutation({
      query: (id) => ({
        url: `/cms/delete-cms/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["cms"],
    }),
  }),
});

export const {
  useAddCMSMutation,
  useGetSingleCMSQuery,
  useUpdateCMSMutation,
  useDeleteCMSMutation,
} = contentManagementApi;
