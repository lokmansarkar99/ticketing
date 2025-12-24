import { apiSlice } from "../rootApi/apiSlice";

const authenticationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // LOGIN USER
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login-user",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    forgetPasswordMail: builder.mutation({
      query: (data) => ({
        url: "/auth/forget-password-request",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    otpVerify: builder.mutation({
      query: (data) => ({
        url: "/auth/otp-verify",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    newPaaswordChange: builder.mutation({
      query: (data) => ({
        url: "/auth/forget-changePassword",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),

    //customer login
    CustomerRequestOtp: builder.mutation({
      query: (phone) => ({
        url: "/customer/request-otp",
        method: "POST",
        body: phone,
      }),
      invalidatesTags: ["user"],
    }),

    //otp
    CustomerVerifyOtp: builder.mutation({
      query: ({ otpToken, otp }) => ({
        url: `/customer/login-with-otp`,
        method: "POST",
        body: { otp, otpToken },
      }),
    }),

    //create customer
    createCustomer: builder.mutation({
      query: (data) => ({
        url: "/customer/create-customer",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),

    // Verify Customer create OTP after registration
    createCustomerOtpVerify: builder.mutation({
      query: ({ otpToken, otp }) => ({
        url: "/customer/create-customer-otp-verify",
        method: "POST",
        body: { otpToken, otp },
      }),
      invalidatesTags: ["user"],
    }),

    loginCustomer: builder.mutation({
      query: (data) => ({
        url: "/customer/login-customer",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),


    //user profile update
    updateCustomer: builder.mutation({
      query: ({ id, data }) => ({
        url: `/customer/update-customer/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),

    // user change password
    customerChangePassword: builder.mutation({
      query: (password) => ({
        url: "/customer/customer-change-password",
        method: "POST",
        body: password,
      }),
      invalidatesTags: ["user"],
    }),

    // user order list 
    customerOrderList: builder.query({
      query: () => ({
        url: `/customer/get-customer-order-list`,
        method: "GET",
      }),

      providesTags: ["booking"],
    }),


    //get single customer
    getSingleCustomerById: builder.query({
      query: (id) => ({
        url: `/customer/get-customer-single/${id}`,
      }),
      providesTags: ["user"],
    }),

  }),
});

export const {
  useLoginMutation,
  useResetPasswordMutation,
  useForgetPasswordMailMutation,
  useOtpVerifyMutation,
  useNewPaaswordChangeMutation,
  useCustomerRequestOtpMutation,
  useCustomerVerifyOtpMutation,
  useCreateCustomerMutation,
  useCreateCustomerOtpVerifyMutation,
  useLoginCustomerMutation,
  useUpdateCustomerMutation,
  useCustomerChangePasswordMutation,
  useCustomerOrderListQuery,
  useGetSingleCustomerByIdQuery,
} = authenticationApi;
