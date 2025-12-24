import { apiSlice } from "@/store/rootApi/apiSlice";



export const blogPostApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE add blog post
    addPost: builder.mutation({
      query: (data) => ({
        url: "/blog/create-blog",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["blogPost"],
    }),

    // Get all blogs with optional query params
    getAllPosts: builder.query({
      query: ({ page = 1, size = 10, search = "", status = "" }) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page.toString());
        if (size) params.append("size", size.toString());
        if (search) params.append("search", search);
        if (status) params.append("status", status);
        return `/blog/get-blog-all?${params.toString()}`;
      },
      providesTags: ["blogPost"],
    }),


      // Get single blog by ID
    getPostById: builder.query({
      query: (id) => `/blog/get-blog-by-id/${id}`,
      providesTags: ["blogPost"],
    }),

     // Update blog by ID
    updatePost: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/blog/update-blog/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["blogPost"],
    }),

      // Delete blog by ID
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/blog/delete-blog/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blogPost"],
    }),

  }),
});


export const {
  useAddPostMutation,
  useGetAllPostsQuery,
  useGetPostByIdQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
} = blogPostApi;
