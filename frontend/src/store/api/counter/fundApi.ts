import { fallback } from "@/utils/constants/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

const fundApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADDING FUND
    addFund: builder.mutation({
      query: (data) => ({
        url: "/fund-prepaid/create-fund-prepaid",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["fund"],
    }),

    // GETTING ALL FUNDS
    getFunds: builder.query({
      query: (data) => ({
        url: `/fund-prepaid/get-fund-prepaid-all?search=${
          data?.search || ""
        }&size=${data?.size || fallback.querySize}&page=${
          data?.page || 1
        }&sortOrder=${data?.sort || fallback.sortOrder}`,
      }),
      providesTags: ["fund"],
    }),

    getFundMoney: builder.query({
      query: () => ({
        url: "/user/get-balance",
      }),
      providesTags: ["fund"],
    }),
    getFundsCounter: builder.query({
      query: (data) => ({
        url: `/fund-prepaid/get-fund-prepaid-counter?search=${
          data?.search || ""
        }&size=${data?.size || fallback.querySize}&page=${
          data?.page || 1
        }&sortOrder=${data?.sort || fallback.sortOrder}`,
      }),
      providesTags: ["fund"],
    }),

    // GETTING SINGLE FUND
    getSingleFund: builder.query({
      query: (id) => ({
        url: `/fund-prepaid/get-fund-single/${id}`,
      }),
      providesTags: ["fund"],
    }),

    // UPDATING FUND
    updateFund: builder.mutation({
      query: ({ id, updateData }) => ({
        url: `/fund-prepaid/update-fund-prepaid/${id}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: ["fund"],
    }),

    // DELETING FUND
    deleteFund: builder.mutation({
      query: (id) => ({
        url: `/fund-prepaid/delete-fund-prepaid/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["fund"],
    }),
  }),
});

export const {
  useAddFundMutation,
  useDeleteFundMutation,
  useGetFundsQuery,
  useGetFundsCounterQuery,
  useGetSingleFundQuery,
  useUpdateFundMutation,
  useGetFundMoneyQuery
} = fundApi;
