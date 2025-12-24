import { apiSlice } from "../../rootApi/apiSlice";

const duePaymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ADDING DUE PAYMENT
    addDuePayment: builder.mutation({
      query: (data) => ({
        url: "/admin/due-payment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["duePayment"],
    }),

    // FINDING DUE PAYMENTS
    findDuePayments: builder.query({
      query: ({
        fuelCompanyId,
        registrationNo,
      }: {
        fuelCompanyId: number;
        registrationNo: string;
      }) => ({
        url: `/admin/find-due`,
        params: {
          fuelCompanyId,
          registrationNo,
        },
      }),
      providesTags: ["duePayment"],
    }),
  }),
});

export const { useAddDuePaymentMutation, useFindDuePaymentsQuery } =
  duePaymentApi;
