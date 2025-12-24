import { fallback } from "@/utils/constants/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

const helperApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //ADDING helper
    addHelper: builder.mutation({
      query: (data) => ({
        url: "/helper/create-helper",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["helper"],
    }),

    //GETTING ALL DRIVERS
    getHelpers: builder.query({
      query: (data) => ({
        url: `/helper/get-helper-all?search=${data?.search || ""}&size=${
          data?.size || fallback.querySize
        }&page=${data?.page || 1}&sortOrder=${
          data?.sort || fallback.sortOrder
        }`,
      }),
      providesTags: ["helper"],
    }),

    // GETTING SINGLE DRIVER
    getSingleHelper: builder.query({
      query: (id) => ({
        url: `/helper/get-helper-single/${id}`,
      }),
      providesTags: ["helper"],
    }),

    // UPDATING DRIVER
    updateHelper: builder.mutation({
      query: ({ id, data }) => ({
        url: `/helper/update-helper/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["helper"],
    }),

    // DELETING DRIVER
    deleteHelper: builder.mutation({
      query: (id) => ({
        url: `/helper/delete-helper/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["helper"],
    }),
  }),
});

export const {
  useAddHelperMutation,
  useGetHelpersQuery,
  useGetSingleHelperQuery,
  useUpdateHelperMutation,
  useDeleteHelperMutation,
} = helperApi;
