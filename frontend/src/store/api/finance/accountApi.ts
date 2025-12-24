import { apiSlice } from "../../rootApi/apiSlice";

const accountApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //ADDING ACCOUNT
    addAccount: builder.mutation({
      query: (data) => ({
        url: "/account/create-account",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["account"],
    }),

    //GETTING ALL ACCOUNT
    getAccounts: builder.query({
      query: (data) => ({
        url: `/account/get-accounts-all?type=${data || ""}`,
      }),
      providesTags: ["account"],
    }),

    // GETTING SINGLE ACCOUNT
    getSingleAccount: builder.query({
      query: (id) => ({
        url: `/account/get-account-single/${id}`,
      }),
      providesTags: ["account"],
    }),

    // UPDATING ACCOUNT
    updateAccount: builder.mutation({
      query: ({ id, data }) => ({
        url: `/account/update-account/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["account"],
    }),

    // DELETING ACCOUNT
    deleteAccount: builder.mutation({
      query: (id) => ({
        url: `/account/delete-account/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["account"],
    }),
  }),
});

export const {
  useAddAccountMutation,
  useDeleteAccountMutation,
  useGetAccountsQuery,
  useGetSingleAccountQuery,
  useUpdateAccountMutation,
} = accountApi;
