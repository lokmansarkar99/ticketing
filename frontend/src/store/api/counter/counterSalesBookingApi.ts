import { apiSlice } from "../../rootApi/apiSlice";

const counterSalesBookingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSalesTickitList: builder.query({
      query: () => ({
        url: `/order/get-today-sales-counter`,
        method: "GET",
      }),

      providesTags: ["counter_sales_booking", "booking"],
    }),
    getSingleOrderDetails: builder.query({
      query: (id) => ({
        url: `/order/get-order-single/${id}`,
      }),
      providesTags: ["counter_sales_booking"],
    }),
    updateDuePayment: builder.mutation({
      query: (orderId: number) => ({
        url: `/order/due-payment/${orderId}`,
        method: "PUT",
      }),
      invalidatesTags: ["counter_sales_booking"],
    }),
  }),
});

export const {
  useGetSalesTickitListQuery,
  useUpdateDuePaymentMutation,
  useGetSingleOrderDetailsQuery,
} = counterSalesBookingApi;
