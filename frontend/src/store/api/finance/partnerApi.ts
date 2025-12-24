import { fallback } from "@/utils/constants/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

const partnerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //ADDING PARTNER
    addPartner: builder.mutation({
      query: (data) => ({
        url: "/investor/create-investor",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["partner"],
    }),

    //GETTING ALL PARTNER
    getPartners: builder.query({
      query: (data) => ({
        url: `/investor/get-investor-all?search=${data?.search || ""}&size=${
          data?.size || fallback.querySize
        }&page=${data?.page || 1}&sortOrder=${
          data?.sort || fallback.sortOrder
        }`,
      }),
      providesTags: ["partner"],
    }),

    // GETTING SINGLE PARTNER
    getSinglePartner: builder.query({
      query: (id) => ({
        url: `/investor/get-investor-single/${id}`,
      }),
      providesTags: ["partner"],
    }),

    // UPDATING PARTNER
    updatePartner: builder.mutation({
      query: ({ id, data }) => ({
        url: `/investor/update-investor/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["partner"],
    }),

    // DELETING PARTNER
    deletePartner: builder.mutation({
      query: (id) => ({
        url: `/investor/delete-investor/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["partner"],
    }),
  }),
});

export const {
  useAddPartnerMutation,
  useDeletePartnerMutation,
  useGetPartnersQuery,
  useGetSinglePartnerQuery,
  useUpdatePartnerMutation,
} = partnerApi;
