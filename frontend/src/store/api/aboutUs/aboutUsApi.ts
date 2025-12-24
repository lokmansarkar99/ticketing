import { apiSlice } from "../../rootApi/apiSlice";

const aboutUsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADDING SLIDER
    addAboutUs: builder.mutation({
      query: (data) => ({
        url: "/about-us/create-about-us",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["about"],
    }),

    // GETTING ALL SLIDERS
    getAboutUsList: builder.query({
      query: () => ({
        url: `/about-us/get-about-us-all`,
      }),
      providesTags: ["about"],
    }),

    // GETTING SINGLE SLIDER BY ID
    getSingleAboutUs: builder.query({
      query: (id) => ({
        url: `/about-us/get-about-us-single/${id}`,
      }),
      providesTags: ["about"],
    }),

    // UPDATING SLIDER
    updateAboutUs: builder.mutation({
      query: ({ id, data }) => ({
        url: `/about-us/update-about-us/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["about"],
    }),

    // DELETING AboutUs
    deleteAboutUs: builder.mutation({
      query: (id) => ({
        url: `/about-us/delete-about-us/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["about"],
    }),
  }),
});

export const {
  useAddAboutUsMutation,
  useGetAboutUsListQuery,
  useGetSingleAboutUsQuery,
  useUpdateAboutUsMutation,
  useDeleteAboutUsMutation,
} = aboutUsApi;
