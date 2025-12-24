import { apiSlice } from "@/store/rootApi/apiSlice";

const userRoleApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUserRoleList: builder.query({
      query: () => ({
        url: `/role/get-role-all`,
        method: "GET",
      }),
      providesTags: ["role"],
    }),
    addRole: builder.mutation({
      query: (data) => ({
        url: "/role/create-role",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["role"], // This is correct
    }),

    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/role/delete-role/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["role"],
    }),
    // UPDATING  permission
    // In your API slice
    updateRole: builder.mutation({
      query: ({ id, data }) => ({
        url: `/role/update-role/${id}`, // Pass the 'id' as a URL parameter
        method: "PUT",
        body: {
          name: data.name,
        },
      }),
      invalidatesTags: ["role"], // Invalidate the cache after update
    }),
    // GETTING SINGLE Permission
    getSingleRole: builder.query({
      query: (id) => ({
        url: `/role/get-role-single/${id}`,
      }),
      providesTags: ["role"],
    }),
  }),
});

export const {
  useGetAllUserRoleListQuery,
  useAddRoleMutation,
  useDeleteRoleMutation,
  useUpdateRoleMutation,
  useGetSingleRoleQuery,
} = userRoleApi;
