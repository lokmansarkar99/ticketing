
import { fallback } from "@/utils/constants/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

export const pagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD PAGE
    addPage: builder.mutation({
      query: (data) => ({
        url: "/pages/create-pages",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["pages"],
    }),

    // GET ALL PAGES
    getPages: builder.query({
      query: (params) => ({
        url: `/pages/get-pages-all?page=${params?.page || 1}&size=${
          params?.size || fallback.querySize
        }&search=${params?.search || ""}`,
      }),
      providesTags: ["pages"],
    }),

    // GET SINGLE PAGE
    getSinglePage: builder.query({
      query: (id) => ({
        url: `/pages/get-pages-by-id/${id}`,
      }),
      providesTags: ["pages"],
    }),

    // UPDATE PAGE
    updatePage: builder.mutation({
      query: ({ id, data }) => ({
        url: `/pages/update-pages/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["pages"],
    }),

    // DELETE PAGE
    deletePage: builder.mutation({
      query: (id) => ({
        url: `/pages/delete-pages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["pages"],
    }),
  }),
});

export const {
  useAddPageMutation,
  useGetPagesQuery,
  useGetSinglePageQuery,
  useUpdatePageMutation,
  useDeletePageMutation,
} = pagesApi;
