import { apiSlice } from "../../rootApi/apiSlice";

const faqApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADDING FAQ
    addFaq: builder.mutation({
      query: (data) => ({
        url: "/faq/create-faq",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["faq"],
    }),

    // GETTING ALL FAQS
    getFaqAllList: builder.query({
      query: () => ({
        url: "/faq/get-faq-all",
      }),
      providesTags: ["faq"],
    }),

    // GETTING SINGLE FAQ BY ID
    getSingleFaq: builder.query({
      query: (id) => ({
        url: `/faq/get-faq-single/${id}`,
      }),
      providesTags: ["faq"],
    }),

    // UPDATING FAQ
    updateFaq: builder.mutation({
      query: ({ id, data }) => ({
        url: `/faq/update-faq/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["faq"],
    }),

    // DELETING FAQ
    deleteFaq: builder.mutation({
      query: (id) => ({
        url: `/faq/delete-faq/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["faq"],
    }),
  }),
});

export const {
  useAddFaqMutation,
  useGetFaqAllListQuery,
  useGetSingleFaqQuery,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqApi;
