import { apiSlice } from "@/store/rootApi/apiSlice";
import { fallback } from "@/utils/constants/common/fallback";

const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //ADDING USER
    addUser: builder.mutation({
      query: (data) => {
        delete data.rePassword;
        return {
          url: "/auth/create-user",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["user"],
    }),

    //GETTING ALL USERS
    getUsers: builder.query({
      query: (data) => {
        const params = new URLSearchParams({
          search: data.search || "",
          userName: data.userName || "",
          contactNo: data.contactNo || "",
          roleId: data.roleId || "",
          counterId: data.counterId || "",
          type: data.type || "",
          status: data.status || "",
          size: data.size,
          page: data.page,
          sortOrder: data.sort,
        });

        return {
          url: `/user/get-user-all?${params.toString()}`,
        };
      },
      providesTags: ["user"],
    }),

    //GETTING ALL GUIDE
    getGuides: builder.query({
      query: (data) => ({
        url: `/user/get-guide-all?search=${data?.search || ""}&size=${
          data?.size || fallback.querySize
        }&page=${data?.page || 1}&sortOrder=${
          data?.sort || fallback.sortOrder
        }`,
      }),
      providesTags: ["user"],
    }),

    // GETTING SINGLE USER
    getSingleUser: builder.query({
      query: (id) => ({
        url: `/user/get-user-by-id/${id}`,
      }),
      providesTags: ["user"],
    }),

    // UPDATING USER
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user/update-user/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),

    // DELETING USER
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/delete-user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),
    getPermissionTypeList: builder.query({
      query: () => ({
        url: `/permission-type/get-permission-type-all`,
        method: "GET",
      }),
      providesTags: ["permissiontype"],
    }),
    addPermission: builder.mutation({
      query: (data) => ({
        url: "/permission-type/create-permission-type",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["permissiontype"], // This is correct
    }),

    deletePermissionType: builder.mutation({
      query: (id) => ({
        url: `/permission-type/delete-permission-type/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["permissiontype"],
    }),
    // UPDATING  permission
    updatePermissionType: builder.mutation({
      query: ({ id, data }) => ({
        url: `/permission-type/update-permission-type/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["permissiontype"],
    }),
    // GETTING SINGLE Permission
    getSinglePermissionType: builder.query({
      query: (id) => ({
        url: `/permission-type/get-permission-type-single/${id}`,
      }),
      providesTags: ["permissiontype"],
    }),
  }),
});

export const {
  useAddUserMutation,
  useGetSingleUserQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUsersQuery,
  useGetGuidesQuery,
  useGetPermissionTypeListQuery,
  useAddPermissionMutation,
  useDeletePermissionTypeMutation,
  useUpdatePermissionTypeMutation,
  useGetSinglePermissionTypeQuery,
} = userApi;
