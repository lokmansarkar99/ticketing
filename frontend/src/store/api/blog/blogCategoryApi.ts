import { apiSlice } from "@/store/rootApi/apiSlice";



export const blogCategoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADD Blog Category
    addBlogCategory: builder.mutation({
      query: (data) => ({
        url: "/blog-category/create-blog-category",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["blog-category"],
    }),

    // GET All Category with pagination and search
    getBlogCategories: builder.query({
      query: ({ page = 1, size = 10, search = "" }) => ({
        url: `/blog-category/get-blog-category-all?page=${page}&size=${size}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["blog-category"],
    }),

    // GET Category by ID
    getBlogCategoryById: builder.query({
      query: (id) => ({
        url: `/blog-category/get-blog-category-by-id/${id}`,
        method: "GET",
      }),
      providesTags: ["blog-category"],
    }),

    // UPDATE Blog Category by ID
    updateBlogCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/blog-category/update-blog-category/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["blog-category"],
    }),

    // DELETE Blog Category  by ID
    deleteBlogCategory: builder.mutation({
      query: (id) => ({
        url: `/blog-category/delete-blog-category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blog-category"],
    }),
  }),
});

export const {
  useAddBlogCategoryMutation,
  useGetBlogCategoriesQuery,
  useGetBlogCategoryByIdQuery,
  useUpdateBlogCategoryMutation,
  useDeleteBlogCategoryMutation,
} = blogCategoryApi;
