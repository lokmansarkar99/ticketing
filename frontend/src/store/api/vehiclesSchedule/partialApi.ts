import { apiSlice } from "../../rootApi/apiSlice";

const partialApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //ADDING COACH

    //GETTING ALL COACH
    getPartialInfoAll: builder.query({
      query: () => ({
        url: `/partial/get-partial-info`,
      }),
      providesTags: ["partial"],
    }),

    // GETTING SINGLE COACH
    getSingleParital: builder.query({
      query: (id) => ({
        url: `/coach/get-coach-single/${id}`,
      }),
      providesTags: ["partial"],
    }),

    // UPDATING COACH
    updatePartialInfo: builder.mutation({
      query: ({ id, data }) => ({
        url: `/partial/update-partial-info/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["partial"],
    }),
  }),
});

export const {
  useGetPartialInfoAllQuery,
  useGetSingleParitalQuery,
  useUpdatePartialInfoMutation,
} = partialApi;
