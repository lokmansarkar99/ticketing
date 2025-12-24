import { fallback } from "@/utils/constants/common/fallback";
import { apiSlice } from "../../rootApi/apiSlice";

const discountApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE DISCOUNT
    createDiscount: builder.mutation({
      query: (data) => ({
        url: "/discount/create-discount",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["discount"],
    }),

    // GET ALL DISCOUNTS
    getAllDiscounts: builder.query({
      query: (data) => ({
        url: `/discount/get-discount-all?search=${data?.search || ""}&size=${
          data?.size || fallback.querySize
        }&page=${data?.page || 1}&sortOrder=${
          data?.sort || fallback.sortOrder
        }`,
      }),
      providesTags: ["discount"],
    }),

    // GET SINGLE DISCOUNT
    getSingleDiscount: builder.query({
      query: (id) => ({
        url: `/discount/get-discount-single/${id}`,
      }),
      providesTags: ["discount"],
    }),

    // CHECK DISCOUNT VALIDITY
    checkDiscountValidity: builder.query({
      query: (title) => ({
        url: `/discount/check-discount-validity?title=${title}`,
        method: "GET",
        // params: data, 
      }),
      providesTags:["coupon"]
    }),

    // UPDATE DISCOUNT
    updateDiscount: builder.mutation({
      query: ({ id, updateData }) => ({
        url: `/discount/update-discount/${id}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: ["discount"],
    }),

    // DELETE DISCOUNT
    deleteDiscount: builder.mutation({
      query: (id) => ({
        url: `/discount/delete-discount/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["discount"],
    }),
  }),
});

export const {
  useCreateDiscountMutation,
  useGetAllDiscountsQuery,
  useGetSingleDiscountQuery,
  useCheckDiscountValidityQuery,
  useUpdateDiscountMutation,
  useDeleteDiscountMutation,
} = discountApi;