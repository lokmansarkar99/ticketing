import { apiSlice } from "@/store/rootApi/apiSlice";

const userPermissionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUserPermissionList: builder.query({
      query: () => ({
        url: `/permission/get-permission-all`,
        method: "GET",
      }),
      providesTags: ["permission"],
    }),
    addPermissionbyId: builder.mutation({
      query: (data) => ({
        url: "/permission/create-permission",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["permission"], // This is correct
    }),

    deletePermission: builder.mutation({
      query: (id) => ({
        url: `/permission/delete-permission/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["permission"],
    }),
    // UPDATING  permission
    // In your API slice
    updatePermission: builder.mutation({
      query: ({ id, data }) => ({
        url: `/permission/update-permission/${id}`, // Pass the 'id' as a URL parameter
        method: "PUT",
        body: {
          name: data.name,
          permissionTypeId: data.permissionTypeId, // Only send the required fields in the request body
        },
      }),
      invalidatesTags: ["permission"], // Invalidate the cache after update
    }),
    // GETTING SINGLE Permission
    getSinglePermission: builder.query({
      query: (id) => ({
        url: `/permission/get-permission-single/${id}`,
      }),
      providesTags: ["permission"],
    }),
  }),
});

export const {
  useGetAllUserPermissionListQuery,
  useAddPermissionbyIdMutation,
  useDeletePermissionMutation,
  useUpdatePermissionMutation,
  useGetSinglePermissionQuery,
} = userPermissionApi;
