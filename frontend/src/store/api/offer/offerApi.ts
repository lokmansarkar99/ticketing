import { apiSlice } from "../../rootApi/apiSlice";

const offerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADDING OFFER
    addOffer: builder.mutation({
      query: (data) => ({
        url: "/offered/create-offered",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["offer"],
    }),

    // GETTING ALL OFFERS
    getOfferAllList: builder.query({
      query: () => ({
        url: "/offered/get-offered-all",
      }),
      providesTags: ["offer"],
    }),

    // GETTING SINGLE OFFER BY ID
    getSingleOffer: builder.query({
      query: (id) => ({
        url: `/offered/get-offered-single/${id}`,
      }),
      providesTags: ["offer"],
    }),

    // UPDATING OFFER
    updateOffer: builder.mutation({
      query: ({ id, data }) => ({
        url: `/offered/update-offered/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["offer"],
    }),

    // DELETING OFFER
    deleteOffer: builder.mutation({
      query: (id) => ({
        url: `/offered/delete-offered/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["offer"],
    }),
  }),
});

export const {
  useAddOfferMutation,
  useGetOfferAllListQuery,
  useGetSingleOfferQuery,
  useUpdateOfferMutation,
  useDeleteOfferMutation,
} = offerApi;
